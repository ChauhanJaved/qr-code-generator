import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Layers, Box, Eye, CircleDot, ImageIcon, Type } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface QRSettings {
  dotsType: "rounded" | "dots" | "classy" | "classy-rounded" | "square" | "extra-rounded";
  cornersSquareType: "dot" | "square" | "extra-rounded";
  cornersDotType: "dot" | "square";
  margin: number;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  frameText: string;
}

interface QRDesignControlsProps {
  fgColor: string;
  setFgColor: (c: string) => void;
  bgColor: string;
  setBgColor: (c: string) => void;
  settings: QRSettings;
  setSettings: (s: QRSettings) => void;
  // For logos, we'll keep it simple for now, maybe just a URL input until Supabase is hooked
  logoUrl?: string;
  setLogoUrl?: (url: string) => void;
  onLogoUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingLogo?: boolean;
}

export const QRDesignControls = ({
  fgColor, setFgColor,
  bgColor, setBgColor,
  settings, setSettings,
  logoUrl, setLogoUrl,
  onLogoUpload, uploadingLogo
}: QRDesignControlsProps) => {

  const updateSetting = <K extends keyof QRSettings>(key: K, value: QRSettings[K]) => {
    setSettings({ ...settings, [key]: value });
  };

  return (
    <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm transition-all duration-300">
      <CardContent className="p-0">
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-border/50 h-12 sm:h-14 bg-transparent p-1">
            <TabsTrigger value="colors" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md text-xs sm:text-sm"><Palette className="w-4 h-4 mr-1 sm:mr-2 hidden sm:block" />Colors</TabsTrigger>
            <TabsTrigger value="shapes" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md text-xs sm:text-sm"><Layers className="w-4 h-4 mr-1 sm:mr-2 hidden sm:block" />Shapes</TabsTrigger>
            <TabsTrigger value="logo" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md text-xs sm:text-sm"><ImageIcon className="w-4 h-4 mr-1 sm:mr-2 hidden sm:block" />Logo</TabsTrigger>
            <TabsTrigger value="options" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-md text-xs sm:text-sm"><Box className="w-4 h-4 mr-1 sm:mr-2 hidden sm:block" />Options</TabsTrigger>
          </TabsList>

          {/* COLORS */}
          <TabsContent value="colors" className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 text-left">
                <Label className="flex items-center gap-2 text-sm font-medium">Foreground Color</Label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    <div className="w-10 h-10 rounded-full border-2 border-border shadow-sm flex items-center justify-center transition-transform hover:scale-110" style={{ backgroundColor: fgColor }}></div>
                  </div>
                  <Input value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-[100px] h-10 font-mono text-sm uppercase" />
                </div>
              </div>
              <div className="space-y-3 text-left">
                <Label className="flex items-center gap-2 text-sm font-medium">Background Color</Label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    <div className="w-10 h-10 rounded-full border-2 border-border shadow-sm flex items-center justify-center transition-transform hover:scale-110" style={{ backgroundColor: bgColor }}></div>
                  </div>
                  <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-[100px] h-10 font-mono text-sm uppercase" />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* SHAPES */}
          <TabsContent value="shapes" className="p-4 sm:p-6 space-y-6">
             <div className="space-y-3 text-left">
              <Label className="flex items-center gap-2 text-sm font-medium"><CircleDot className="w-4 h-4" /> Pattern Style</Label>
              <Select value={settings.dotsType} onValueChange={(v: any) => updateSetting("dotsType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="dots">Dots</SelectItem>
                  <SelectItem value="rounded">Rounded</SelectItem>
                  <SelectItem value="extra-rounded">Extra Rounded</SelectItem>
                  <SelectItem value="classy">Classy</SelectItem>
                  <SelectItem value="classy-rounded">Classy Rounded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3 text-left">
                <Label className="flex items-center gap-2 text-sm font-medium"><Eye className="w-4 h-4" /> Eye Frame Shape</Label>
                <Select value={settings.cornersSquareType} onValueChange={(v: any) => updateSetting("cornersSquareType", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="dot">Dot</SelectItem>
                    <SelectItem value="extra-rounded">Rounded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3 text-left">
                <Label className="flex items-center gap-2 text-sm font-medium">Eyeball Shape</Label>
                <Select value={settings.cornersDotType} onValueChange={(v: any) => updateSetting("cornersDotType", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="dot">Dot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* LOGO */}
          <TabsContent value="logo" className="p-4 sm:p-6 space-y-6">
            <div className="space-y-3 text-left">
              <Label className="flex items-center gap-2 text-sm font-medium">Upload Logo (PNG, JPG, SVG)</Label>
              <div className="flex items-center gap-4">
                <Input 
                  type="file" 
                  accept="image/png, image/jpeg, image/svg+xml" 
                  onChange={onLogoUpload} 
                  disabled={uploadingLogo}
                  className="cursor-pointer file:text-primary file:bg-primary/10 file:border-none file:rounded-md file:px-4 file:py-1 hover:file:bg-primary/20 transition-colors" 
                />
              </div>
              {uploadingLogo && <p className="text-xs text-muted-foreground animate-pulse">Uploading...</p>}
            </div>
            <div className="space-y-3 text-left">
              <Label className="flex items-center gap-2 text-sm font-medium">Or enter Logo URL</Label>
              <Input placeholder="https://example.com/logo.png" value={logoUrl || ""} onChange={(e) => setLogoUrl?.(e.target.value)} />
            </div>
          </TabsContent>

          {/* OPTIONS */}
          <TabsContent value="options" className="p-4 sm:p-6 space-y-6 text-left">
            <div className="space-y-3">
              <Label className="flex flex-col gap-1 text-sm font-medium">
                <span>Quiet Zone (Margin)</span>
                <span className="text-xs text-muted-foreground font-normal">Adds padding around the QR code</span>
              </Label>
              <div className="flex items-center gap-4">
                <Slider 
                  value={[settings.margin]} 
                  onValueChange={(val) => updateSetting("margin", val[0])} 
                  max={20} 
                  step={1} 
                  className="flex-1"
                />
                <span className="w-8 text-right text-sm">{settings.margin}px</span>
              </div>
            </div>
            <div className="space-y-3 text-left">
              <Label className="flex items-center gap-2 text-sm font-medium">Error Correction Level</Label>
              <Select value={settings.errorCorrectionLevel} onValueChange={(v: any) => updateSetting("errorCorrectionLevel", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%)</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30% - Best for Logos)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3 text-left">
              <Label className="flex items-center gap-2 text-sm font-medium"><Type className="w-4 h-4" /> Frame Text</Label>
              <Input 
                value={settings.frameText} 
                onChange={(e) => updateSetting("frameText", e.target.value)} 
                placeholder="e.g. SCAN ME" 
              />
              <p className="text-xs text-muted-foreground">Appears below the QR Code (will be included in downloads).</p>
            </div>
          </TabsContent>

        </Tabs>
      </CardContent>
    </Card>
  );
};
