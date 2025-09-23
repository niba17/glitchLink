// frontend-final/src/features/analytics/constants/analyticsKeys.ts
import {
  DeviceKey,
  BrowserKey,
  OSKey,
  ReferrerKey,
} from "@/features/analytics/types/type";

// Device, browser, OS key arrays
export const devices: DeviceKey[] = ["Desktop", "Smartphone", "Tablet"];
export const browsers: BrowserKey[] = [
  "Chrome",
  "Firefox",
  "Microsoft Edge",
  "Safari",
  "Opera",
  "Instagram App",
];
export const osList: OSKey[] = ["Windows", "macOS", "Linux", "Android", "iOS"];

export const referrers: ReferrerKey[] = [
  "Instagram App",
  "WhatsApp",
  "Facebook",
  "LinkedIn",
  "GitHub",
  "Direct",
];

// All keys combined (mutable array, bukan readonly)
export const allKeys: (DeviceKey | BrowserKey | OSKey | ReferrerKey)[] = [
  ...devices,
  ...browsers,
  ...osList,
  ...referrers,
];
