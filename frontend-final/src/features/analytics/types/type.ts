// Lokasi File: frontend-final/src/features/analytics/types/type.ts

export type DeviceKey = "Desktop" | "Smartphone" | "Tablet";
export type OSKey = "Windows" | "macOS" | "Linux" | "Android" | "iOS";
export type BrowserKey =
  | "Chrome"
  | "Firefox"
  | "Microsoft Edge"
  | "Safari"
  | "Opera"
  | "Instagram App";
export type ReferrerKey =
  | "Instagram App"
  | "WhatsApp"
  | "Facebook"
  | "LinkedIn"
  | "GitHub"
  | "Direct";

export type ChartKey = DeviceKey | BrowserKey | OSKey | ReferrerKey;

// Tambahkan definisi dan ekspor ChartDataItem di sini
export interface ChartDataItem {
  date: string;
  [key: string]: number | string;
}

// Tambahkan tipe-tipe ini yang dibutuhkan untuk hook useLineChartActiveKeys
export type ActiveState = {
  devices: DeviceKey[];
  browsers: BrowserKey[];
  osList: OSKey[];
};

export type ActiveKeyType = keyof ActiveState;

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

export type TotalClickChartDataItem = {
  name: string;
  clicks: number;
  fill: string;
};

// Chart item khusus referrer
export type ReferrerChartDataItem = {
  name: ReferrerKey;
  clicks: number;
  fill: string;
};
