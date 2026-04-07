import React, { useState, useRef, useEffect, useCallback } from "react";
import QRCodeStyling from "qr-code-styling";
import { toPng, toSvg } from "html-to-image";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { QRContentInput } from "./QRContentInput";
import { QRDesignControls, QRSettings } from "./QRDesignControls";

interface QRGeneratorProps {
  onSaved?: () => void;
}

const QRGenerator = ({ onSaved }: QRGeneratorProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const editData = location.state?.editData;

  
  // State
  const [content, setContent] = useState(editData?.content || "");
  const [contentType, setContentType] = useState(editData ? "text" : "url"); // fallback edited data to text mode to preserve string
  const [title, setTitle] = useState(editData?.title || "");
  const [fgColor, setFgColor] = useState(editData?.foreground_color || "#000000");
  const [bgColor, setBgColor] = useState(editData?.background_color || "#FFFFFF");
  const [logoUrl, setLogoUrl] = useState(editData?.logo_url || "");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState<QRSettings>(editData?.settings || {
    dotsType: "square",
    cornersSquareType: "square",
    cornersDotType: "square",
    margin: 2,
    errorCorrectionLevel: "Q",
    frameText: ""
  });

  // Refs
  const qrRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  // Rebuild QR on every relevant change so preview reflects margin updates immediately
  useEffect(() => {
    if (!qrRef.current) return;

    const size = window.innerWidth < 640 ? 220 : 280;
    const nextQrCode = new QRCodeStyling({
      width: size,
      height: size,
      type: "svg",
      data: content || " ",
      image: logoUrl || undefined,
      margin: settings.margin,
      qrOptions: {
        errorCorrectionLevel: settings.errorCorrectionLevel
      },
      dotsOptions: {
        color: fgColor,
        type: settings.dotsType
      },
      backgroundOptions: {
        color: bgColor,
      },
      cornersSquareOptions: {
        color: fgColor,
        type: settings.cornersSquareType === "extra-rounded" ? "extra-rounded" : settings.cornersSquareType
      },
      cornersDotOptions: {
        color: fgColor,
        type: settings.cornersDotType
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 5,
        imageSize: 0.4,
        hideBackgroundDots: true
      }
    });

    qrCode.current = nextQrCode;
    qrRef.current.innerHTML = "";
    nextQrCode.append(qrRef.current);
  }, [content, fgColor, bgColor, logoUrl, settings]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!user) {
      toast.error("Please log in to upload logos.");
      return;
    }

    try {
      setUploadingLogo(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('logos').getPublicUrl(filePath);
      setLogoUrl(data.publicUrl);
      toast.success("Logo uploaded!");
    } catch (error) {
      toast.error("Failed to upload logo.");
      console.error(error);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleDownload = async (format: "png" | "svg" | "pdf") => {
    if (!containerRef.current || !qrCode.current) return;
    
    try {
      if (!settings.frameText && format !== "pdf") {
        // Native clean export from library
        await qrCode.current.download({ name: `qrify-${Date.now()}`, extension: format });
        return;
      }
      
      // Use html-to-image for frame included
      if (format === "png") {
        const dataUrl = await toPng(containerRef.current, { quality: 1, backgroundColor: bgColor, style: { padding: '20px' } });
        const link = document.createElement('a');
        link.download = `qrify-framed-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } else if (format === "svg") {
        const dataUrl = await toSvg(containerRef.current, { backgroundColor: bgColor, style: { padding: '20px' } });
        const link = document.createElement('a');
        link.download = `qrify-framed-${Date.now()}.svg`;
        link.href = dataUrl;
        link.click();
      } else if (format === "pdf") {
        const dataUrl = await toPng(containerRef.current, { quality: 1, backgroundColor: bgColor, style: { padding: '20px' } });
        const pdf = new jsPDF();
        pdf.addImage(dataUrl, 'PNG', 15, 40, 180, 180 * (containerRef.current.offsetHeight / containerRef.current.offsetWidth));
        pdf.save(`qrify-${Date.now()}.pdf`);
      }
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Download failed due to cross-origin images or browser limits.");
    }
  };

  const saveQR = async () => {
    if (!user) {
      toast.error("Please login to save QR codes.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("qr_codes").insert({
        user_id: user.id,
        title: title || `${contentType.toUpperCase()} Code`,
        content,
        type: contentType,
        foreground_color: fgColor,
        background_color: bgColor,
        eye_shape: settings.cornersSquareType,
        logo_url: logoUrl || null,
        settings: settings as any // Store all advanced properties!
      });
      if (error) throw error;
      toast.success("QR code saved to your dashboard!");
      onSaved?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save QR code. Ensure the DB migration for 'settings' was executed!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:gap-8 lg:grid-cols-12 max-w-7xl mx-auto px-2 sm:px-0">
      <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4 sm:gap-6 min-w-0">
        <div className="flex justify-between items-end gap-4 px-1">
           {user && (
             <div className="flex-1 max-w-sm">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Title (Save Name)</label>
                <input 
                  type="text" 
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm lg:text-lg lg:font-semibold" 
                  placeholder="My QR Code" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                />
             </div>
           )}
        </div>
        
        {/* Content Tabs Input */}
        <QRContentInput 
          initialType={editData ? "text" : "url"} 
          initialText={editData?.content}
          onContentChange={(c, t) => { setContent(c); setContentType(t); }} 
        />
        
        {/* Design Settings */}
        <QRDesignControls 
          fgColor={fgColor} setFgColor={setFgColor}
          bgColor={bgColor} setBgColor={setBgColor}
          settings={settings} setSettings={setSettings}
          logoUrl={logoUrl} setLogoUrl={setLogoUrl}
          onLogoUpload={handleLogoUpload} uploadingLogo={uploadingLogo}
        />
      </div>

      <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-center min-w-0">
        <div className="lg:sticky lg:top-24 w-full">
          <div className="relative group perspective-1000">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary/30 via-primary/5 to-transparent blur-3xl opacity-50 xl:opacity-100 transition duration-500 will-change-transform" />
            <Card className="relative border-border/60 shadow-2xl overflow-hidden bg-card/80 backdrop-blur-xl">
              <CardContent className="flex flex-col items-center gap-6 p-8 relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ScanlineIcon />
                </div>
                
                <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase self-start mb-2">Live Preview</h3>
                
                <div 
                  ref={containerRef} 
                  className="rounded-2xl flex flex-col items-center justify-center p-4 transition-all"
                  style={{ backgroundColor: bgColor }}
                >
                  <div ref={qrRef} className="flex items-center justify-center [&>svg]:!block [&>canvas]:!block" />
                  {settings.frameText && (
                    <div 
                      className="mt-4 text-center font-bold tracking-widest text-lg w-full"
                      style={{ color: fgColor }}
                    >
                      {settings.frameText}
                    </div>
                  )}
                </div>
                
                <div className="w-full flex-col flex gap-2 w-full mt-4">
                  <div className="flex gap-2">
                    <Button onClick={() => handleDownload("png")} variant="default" className="flex-1 font-medium shadow-md">
                      <Download className="mr-2 h-4 w-4" /> PNG
                    </Button>
                    <Button onClick={() => handleDownload("svg")} variant="outline" className="flex-1 font-medium bg-background/50">
                      SVG
                    </Button>
                    <Button onClick={() => handleDownload("pdf")} variant="outline" className="flex-1 font-medium bg-background/50">
                      PDF
                    </Button>
                  </div>
                  {user && (
                    <Button onClick={saveQR} disabled={saving} variant="secondary" className="w-full mt-2 font-medium">
                      <Save className="mr-2 h-4 w-4" />
                      {saving ? "Saving..." : "Save to Dashboard"}
                    </Button>
                  )}
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScanlineIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
    <path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><path d="M4 12h16"></path>
  </svg>
)

export default QRGenerator;
