import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Link as LinkIcon, Type, Wifi, Mail, Phone, MessageSquare, 
  Contact, MapPin, Calendar, Youtube, Link2 
} from "lucide-react";
import {
  formatUrl, formatText, formatWifi, formatEmail, formatPhone, formatSms, 
  formatVCard, formatLocation, formatEvent, formatUpi
} from "@/lib/qr-formatters";

export const CONTENT_TYPES = [
  { id: "url", label: "URL", icon: LinkIcon },
  { id: "text", label: "Text", icon: Type },
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "email", label: "Email", icon: Mail },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "sms", label: "SMS", icon: MessageSquare },
  { id: "vcard", label: "vCard", icon: Contact },
  { id: "location", label: "Location", icon: MapPin },
  { id: "event", label: "Event", icon: Calendar },
  { id: "youtube", label: "YouTube", icon: Youtube },
  { id: "upi", label: "UPI (India)", icon: Link2 },
];

interface QRContentInputProps {
  onContentChange: (content: string, type: string) => void;
  initialType?: string;
  initialText?: string;
}

export const QRContentInput = ({ onContentChange, initialType = "url", initialText = "" }: QRContentInputProps) => {
  const [activeType, setActiveType] = useState(initialType);
  
  // States for different types
  const [url, setUrl] = useState("https://example.com");
  const [text, setText] = useState(initialText || "Hello World");

  
  // WiFi
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiEnc, setWifiEnc] = useState<"WPA" | "WEP" | "nopass">("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);
  
  // Email
  const [email, setEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  
  // Phone/SMS
  const [phone, setPhone] = useState("");
  const [smsMsg, setSmsMsg] = useState("");
  
  // VCard
  const [vcFirst, setVcFirst] = useState("");
  const [vcLast, setVcLast] = useState("");
  const [vcPhone, setVcPhone] = useState("");
  const [vcEmail, setVcEmail] = useState("");
  const [vcOrg, setVcOrg] = useState("");
  const [vcTitle, setVcTitle] = useState("");
  
  // Location
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  
  // Event
  const [evTitle, setEvTitle] = useState("");
  const [evStart, setEvStart] = useState("");
  const [evEnd, setEvEnd] = useState("");
  const [evLoc, setEvLoc] = useState("");
  
  // YouTube
  const [ytUrl, setYtUrl] = useState("");
  
  // UPI
  const [upiPa, setUpiPa] = useState("");
  const [upiPn, setUpiPn] = useState("");
  const [upiAm, setUpiAm] = useState("");

  // Update effect
  useEffect(() => {
    let result = "";
    switch (activeType) {
      case "url": result = formatUrl(url || "https://example.com"); break;
      case "text": result = formatText(text || " "); break;
      case "wifi": result = formatWifi(wifiSsid || "network", wifiPass, wifiEnc, wifiHidden); break;
      case "email": result = formatEmail(email || "test@example.com", emailSubject, emailBody); break;
      case "phone": result = formatPhone(phone || "1234567890"); break;
      case "sms": result = formatSms(phone || "1234567890", smsMsg); break;
      case "vcard": result = formatVCard({ firstName: vcFirst || "John", lastName: vcLast || "Doe", phone: vcPhone, email: vcEmail, organization: vcOrg, title: vcTitle }); break;
      case "location": result = formatLocation(lat || "0", lng || "0"); break;
      case "event": result = formatEvent({ title: evTitle || "Event", start: evStart ? new Date(evStart) : new Date(), end: evEnd ? new Date(evEnd) : new Date(), location: evLoc }); break;
      case "youtube": result = formatUrl(ytUrl || "https://youtube.com"); break;
      case "upi": result = formatUpi(upiPa || "john@upi", upiPn || "John", upiAm); break;
      default: result = url;
    }
    onContentChange(result, activeType);
  }, [
    activeType, url, text, wifiSsid, wifiPass, wifiEnc, wifiHidden,
    email, emailSubject, emailBody, phone, smsMsg,
    vcFirst, vcLast, vcPhone, vcEmail, vcOrg, vcTitle,
    lat, lng, evTitle, evStart, evEnd, evLoc,
    ytUrl, upiPa, upiPn, upiAm, onContentChange
  ]);

  return (
    <Card className="border-border/50 shadow-sm mb-6 bg-card/50 backdrop-blur-sm transition-all duration-300 w-full overflow-hidden">
      <CardContent className="p-0">
        <Tabs defaultValue={initialType} value={activeType} onValueChange={setActiveType} className="w-full">
          <div className="overflow-x-auto w-full custom-scrollbar border-b border-border/50">
            <TabsList className="inline-flex h-12 sm:h-14 items-center justify-start rounded-none bg-transparent p-1.5 sm:p-2 gap-1.5 sm:gap-2 w-max min-w-full">
              {CONTENT_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <TabsTrigger 
                    key={type.id} 
                    value={type.id}
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-full px-3 sm:px-4 h-8 sm:h-10 gap-1.5 sm:gap-2 text-xs sm:text-sm transition-all hover:bg-secondary/80 flex-shrink-0"
                  >
                    <Icon className="h-4 w-4" />
                    {type.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
          
          <div className="p-4 sm:p-6">
            <TabsContent value="url" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-2">
                <Label>Website URL</Label>
                <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
              </div>
            </TabsContent>

            <TabsContent value="text" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-2">
                <Label>Plain Text</Label>
                <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter any text here..." className="min-h-[100px]" />
              </div>
            </TabsContent>

            <TabsContent value="wifi" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <Label>Network Name (SSID)</Label>
                  <Input value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)} placeholder="My WiFi Network" />
                </div>
                <div className="space-y-2 text-left">
                  <Label>Password</Label>
                  <Input type="password" value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} placeholder="SecretPassword123" />
                </div>
                <div className="space-y-2 text-left">
                  <Label>Encryption</Label>
                  <Select value={wifiEnc} onValueChange={(val: any) => setWifiEnc(val)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WPA">WPA/WPA2/WPA3</SelectItem>
                      <SelectItem value="WEP">WEP</SelectItem>
                      <SelectItem value="nopass">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 mt-8">
                  <Switch id="wifi-hidden" checked={wifiHidden} onCheckedChange={setWifiHidden} />
                  <Label htmlFor="wifi-hidden">Hidden Network</Label>
                </div>
              </div>
            </TabsContent>

            {/* Additional Tabs for Email, Phone, SMS, vCard, etc. */}
            <TabsContent value="email" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-2 text-left">
                <Label>Email Address</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contact@example.com" />
              </div>
              <div className="space-y-2 text-left">
                <Label>Subject (Optional)</Label>
                <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Hello!" />
              </div>
              <div className="space-y-2 text-left">
                <Label>Message Body (Optional)</Label>
                <Textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder="Write your message..." />
              </div>
            </TabsContent>

            <TabsContent value="phone" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-2 text-left">
                <Label>Phone Number</Label>
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 8900" />
              </div>
            </TabsContent>

            <TabsContent value="sms" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-2 text-left">
                <Label>Phone Number</Label>
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 8900" />
              </div>
              <div className="space-y-2 text-left">
                <Label>Message</Label>
                <Textarea value={smsMsg} onChange={(e) => setSmsMsg(e.target.value)} placeholder="Hi there..." />
              </div>
            </TabsContent>

            <TabsContent value="vcard" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <Label>First Name</Label>
                  <Input value={vcFirst} onChange={(e) => setVcFirst(e.target.value)} placeholder="John" />
                </div>
                <div className="space-y-2 text-left">
                  <Label>Last Name</Label>
                  <Input value={vcLast} onChange={(e) => setVcLast(e.target.value)} placeholder="Doe" />
                </div>
                <div className="space-y-2 text-left">
                  <Label>Phone Number</Label>
                  <Input value={vcPhone} onChange={(e) => setVcPhone(e.target.value)} placeholder="+1 234 567 8900" />
                </div>
                <div className="space-y-2 text-left">
                  <Label>Email</Label>
                  <Input type="email" value={vcEmail} onChange={(e) => setVcEmail(e.target.value)} placeholder="john@example.com" />
                </div>
                <div className="space-y-2 text-left">
                  <Label>Company</Label>
                  <Input value={vcOrg} onChange={(e) => setVcOrg(e.target.value)} placeholder="Acme Inc" />
                </div>
                <div className="space-y-2 text-left">
                  <Label>Job Title</Label>
                  <Input value={vcTitle} onChange={(e) => setVcTitle(e.target.value)} placeholder="Manager" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="location" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <Label>Latitude</Label>
                  <Input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="40.7128" />
                </div>
                <div className="space-y-2 text-left">
                  <Label>Longitude</Label>
                  <Input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="-74.0060" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="event" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-2 text-left">
                <Label>Event Title</Label>
                <Input value={evTitle} onChange={(e) => setEvTitle(e.target.value)} placeholder="Birthday Party" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <Label>Start Time</Label>
                  <Input type="datetime-local" value={evStart} onChange={(e) => setEvStart(e.target.value)} />
                </div>
                <div className="space-y-2 text-left">
                  <Label>End Time</Label>
                  <Input type="datetime-local" value={evEnd} onChange={(e) => setEvEnd(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2 text-left">
                <Label>Location (Optional)</Label>
                <Input value={evLoc} onChange={(e) => setEvLoc(e.target.value)} placeholder="123 Main St" />
              </div>
            </TabsContent>
            
            <TabsContent value="youtube" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2">
               <div className="space-y-2 text-left">
                <Label>YouTube Video/Channel URL</Label>
                <Input value={ytUrl} onChange={(e) => setYtUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
              </div>
            </TabsContent>
            
            <TabsContent value="upi" className="mt-0 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-2 text-left">
                <Label>UPI ID (VPA)</Label>
                <Input value={upiPa} onChange={(e) => setUpiPa(e.target.value)} placeholder="name@bank" />
              </div>
              <div className="space-y-2 text-left">
                <Label>Payee Name</Label>
                <Input value={upiPn} onChange={(e) => setUpiPn(e.target.value)} placeholder="John Doe" />
              </div>
              <div className="space-y-2 text-left">
                <Label>Amount (Optional)</Label>
                <Input type="number" value={upiAm} onChange={(e) => setUpiAm(e.target.value)} placeholder="100.00" />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
