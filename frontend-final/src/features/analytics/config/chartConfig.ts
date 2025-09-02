// frontend-final/src/features/analytics/config/chartConfig.ts

export type DeviceKey = "Desktop" | "Mobile" | "Tablet";
export type OSKey = "Windows" | "macOS" | "Linux" | "Android" | "iOS";
export type BrowserKey = "Chrome" | "Firefox" | "Edge" | "Safari" | "Opera";

export const chartConfig: Record<
  DeviceKey | OSKey | BrowserKey,
  { label: string; color: string }
> = {
  Desktop: { label: "Desktop", color: "#1ee85a" },
  Mobile: { label: "Mobile", color: "#e81e54" },
  Tablet: { label: "Tablet", color: "#9D4EDD" },
  Windows: { label: "Windows", color: "#00BCF2" },
  macOS: { label: "macOS", color: "#999999" },
  Linux: { label: "Linux", color: "#FCC624" },
  Android: { label: "Android", color: "#3DDC84" },
  iOS: { label: "iOS", color: "#A2AAAD" },
  Chrome: { label: "Chrome", color: "#4285F4" },
  Firefox: { label: "Firefox", color: "#FF7139" },
  Edge: { label: "Edge", color: "#0c9dff" },
  Safari: { label: "Safari", color: "#00A1F1" },
  Opera: { label: "Opera", color: "#cc0f16" },
};
