export type DeviceKey = "Desktop" | "Mobile" | "Tablet";
export type OSKey = "Windows" | "macOS" | "Linux" | "Android" | "iOS";
export type BrowserKey = "Chrome" | "Firefox" | "Edge" | "Safari" | "Opera";
export type ChartKey = DeviceKey | BrowserKey | OSKey;

export interface ClickEvent {
  id: number;
  ip: string;
  country: string | null;
  city: string | null;
  userAgent: string;
  browser: BrowserKey;
  os: OSKey;
  device: DeviceKey;
  timestamp: string;
}

export interface LinkAnalyticsResponse {
  clicksCount: number;
  clicks: ClickEvent[];
  originalUrl: string;
  shortUrl: string;
  // properti lain yang mungkin ada
}
