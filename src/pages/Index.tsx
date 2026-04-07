import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QRGenerator from "@/components/QRGenerator";
import { Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
          <div className="absolute inset-0">
            <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                100% Free Forever - No Hidden Limits
              </div>
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Create Beautiful{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  QR Codes
                </span>{" "}
                Instantly
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground mt-2">
                Generate highly customizable QR codes with 13+ data types, premium patterns, and Supabase-powered logo uploads. Download in stunning PNG or SVG. No limits, no expiration.
              </p>
            </div>

            <QRGenerator />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
