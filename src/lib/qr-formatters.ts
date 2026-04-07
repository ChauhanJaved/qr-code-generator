export const formatUrl = (url: string) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

export const formatText = (text: string) => text;

export const formatWifi = (ssid: string, password?: string, encryption: 'WPA' | 'WEP' | 'nopass' = 'WPA', hidden: boolean = false) => {
  const enc = encryption === 'nopass' ? '' : encryption;
  return `WIFI:T:${enc};S:${ssid};P:${password || ''};H:${hidden ? 'true' : 'false'};;`;
};

export const formatEmail = (email: string, subject?: string, body?: string) => {
  let res = `mailto:${email}`;
  if (subject || body) {
    res += '?';
    const params = [];
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    res += params.join('&');
  }
  return res;
};

export const formatPhone = (phone: string) => `tel:${phone}`;

export const formatSms = (phone: string, message?: string) => {
  return `smsto:${phone}${message ? `:${message}` : ''}`;
};

export interface VCardData {
  firstName: string;
  lastName: string;
  organization?: string;
  title?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
}

export const formatVCard = (data: VCardData) => {
  return `BEGIN:VCARD
VERSION:3.0
N:${data.lastName};${data.firstName};;;
FN:${data.firstName} ${data.lastName}
${data.organization ? `ORG:${data.organization}\n` : ''}${data.title ? `TITLE:${data.title}\n` : ''}${data.phone ? `TEL;TYPE=CELL:${data.phone}\n` : ''}${data.email ? `EMAIL;TYPE=WORK,INTERNET:${data.email}\n` : ''}${data.website ? `URL:${data.website}\n` : ''}${data.address ? `ADR;TYPE=HOME:;;${data.address};;;;\n` : ''}END:VCARD`;
};

export const formatLocation = (lat: string, lng: string) => `geo:${lat},${lng}`;

export interface EventData {
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
}

const formatICalDate = (date: Date) => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

export const formatEvent = (data: EventData) => {
  return `BEGIN:VEVENT
SUMMARY:${data.title}
DTSTART:${formatICalDate(data.start)}
DTEND:${formatICalDate(data.end)}
${data.location ? `LOCATION:${data.location}\n` : ''}${data.description ? `DESCRIPTION:${data.description}\n` : ''}END:VEVENT`;
};

export const formatUpi = (pa: string, pn: string, am?: string) => {
  let res = `upi://pay?pa=${pa}&pn=${pn}`;
  if (am) res += `&am=${am}`;
  return res;
};
