// frontend-final/src/features/analytics/constants/analyticsKeys.ts
import { DeviceKey, BrowserKey, OSKey } from "@/features/analytics/types/type";

// Device, browser, OS key arrays
export const devices: DeviceKey[] = ["Desktop", "Mobile", "Tablet"];
export const browsers: BrowserKey[] = [
  "Chrome",
  "Firefox",
  "Edge",
  "Safari",
  "Opera",
];
export const osList: OSKey[] = ["Windows", "macOS", "Linux", "Android", "iOS"];

// All keys combined (mutable array, bukan readonly)
export const allKeys: (DeviceKey | BrowserKey | OSKey)[] = [
  ...devices,
  ...browsers,
  ...osList,
];
