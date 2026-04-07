import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Calendar, Search, Edit2 } from "lucide-react";
import { toast } from "sonner";
import QRCodeStyling from "qr-code-styling";

interface QRCodeRecord {
  id: string;
  title: string;
  content: string;
  type: string;
  foreground_color: string;
  background_color: string;
  eye_shape: string;
  logo_url: string | null;
  settings: any;
  created_at: string;
}

const SavedQRCard = ({ code, onDelete }: { code: QRCodeRecord, onDelete: (id: string) => void }) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    const settings = code.settings || {};
    qrCode.current = new QRCodeStyling({
      width: 120,
      height: 120,
      type: "svg",
      data: code.content,
      image: code.logo_url || undefined,
      margin: settings.margin ?? 2,
      qrOptions: {
        errorCorrectionLevel: settings.errorCorrectionLevel ?? "Q"
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 5,
        imageSize: 0.4,
        hideBackgroundDots: true
      },
      dotsOptions: {
        color: code.foreground_color,
        type: settings.dotsType ?? "square"
      },
      backgroundOptions: {
        color: code.background_color,
      },
      cornersSquareOptions: {
        color: code.foreground_color,
        type: code.eye_shape as any ?? "square"
      },
      cornersDotOptions: {
        color: code.foreground_color,
        type: settings.cornersDotType ?? "square"
      }
    });

    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qrCode.current.append(qrRef.current);
    }
  }, [code]);

  return (
    <Card className="group overflow-hidden border-border/50 transition-all hover:shadow-lg bg-card relative">
      <CardContent className="p-6">
        <div className="absolute top-2 right-2 flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
          {/* Note: In a real app we'd pass this state back to the generator via React context or URL. 
              Since they asked for re-edits, we can use Link state */}
          <Button variant="secondary" size="icon" className="h-8 w-8 hover:text-primary" asChild>
            <Link to="/" state={{ editData: code }}>
              <Edit2 className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDelete(code.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="mb-4 flex justify-center rounded-lg p-4" style={{ backgroundColor: code.background_color }}>
          <div ref={qrRef} />
        </div>
        <h3 className="mb-1 truncate font-semibold text-foreground">{code.title || "Untitled QR"}</h3>
        <p className="mb-3 truncate text-xs text-muted-foreground bg-muted p-1 rounded font-mono">{code.content}</p>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-muted-foreground uppercase tracking-widest font-semibold border px-2 py-0.5 rounded-full border-primary/20 text-primary">
            {code.type}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {new Date(code.created_at).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [codes, setCodes] = useState<QRCodeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const fetchCodes = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("qr_codes")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load QR codes. Are migrations applied?");
    } else {
      setCodes(data as unknown as QRCodeRecord[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchCodes();
  }, [user]);

  const deleteCode = async (id: string) => {
    const { error } = await supabase.from("qr_codes").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      setCodes((prev) => prev.filter((c) => c.id !== id));
      toast.success("QR code deleted");
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1 p-8">
          <div className="mx-auto max-w-7xl space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredCodes = codes.filter(c => 
    c.title?.toLowerCase().includes(search.toLowerCase()) || 
    c.type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My QR Codes</h1>
              <p className="text-muted-foreground text-sm mt-1">Manage, search, and edit your saved QR codes completely free.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search titles or types..." 
                  className="pl-9 w-full sm:w-[250px]"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Button asChild>
                <Link to="/">
                  <Plus className="mr-2 h-4 w-4" />
                  New
                </Link>
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
            </div>
          ) : codes.length === 0 ? (
            <Card className="border-dashed bg-card/50">
              <CardContent className="flex flex-col items-center gap-4 py-20 text-center">
                <div className="rounded-full bg-primary/10 p-5 shadow-inner">
                  <Plus className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">No QR codes yet</h3>
                  <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Create your first highly customizable QR code and save it to your dashboard permanently for free.</p>
                </div>
                <Button asChild size="lg" className="mt-2">
                  <Link to="/">Start Creating</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCodes.map((code) => (
                <SavedQRCard key={code.id} code={code} onDelete={deleteCode} />
              ))}
              {filteredCodes.length === 0 && search && (
                <div className="col-span-full py-12 text-center text-muted-foreground">
                  No QR codes found matching "{search}".
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
