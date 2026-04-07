import { QrCode } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border/50 bg-muted/30 py-8">
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 text-center text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <QrCode className="h-4 w-4 text-primary" />
        <span className="font-semibold text-foreground">QRify</span>
      </div>
      <p>© {new Date().getFullYear()} QRify. Generate beautiful QR codes instantly.</p>
    </div>
  </footer>
);

export default Footer;
