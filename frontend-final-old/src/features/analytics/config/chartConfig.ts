import { DeviceKey, OSKey, BrowserKey } from "../types/type";

export const chartConfig: Record<
  DeviceKey | OSKey | BrowserKey,
  { label: string; color: string }
> = {
  Desktop: { label: "Desktop", color: "#3B82F6" },
  Tablet: { label: "Tablet", color: "#22C55E" },
  Mobile: { label: "Mobile", color: "#EAB308" },

  Windows: { label: "Windows", color: "#2563EB" }, // blue-600
  macOS: { label: "macOS", color: "#8c8c8c" }, // purple-600
  Linux: { label: "Linux", color: "#9900cc" }, // green-600
  Android: { label: "Android", color: "#3DDC84" }, // official Android green
  iOS: { label: "iOS", color: "#F5F5F7" }, // black (Apple identity)

  // Browsers
  Chrome: { label: "Chrome", color: "#F4B400" }, // Google yellow
  Firefox: { label: "Firefox", color: "#FF7139" }, // Firefox orange
  Edge: { label: "Edge", color: "#0A84FF" }, // Edge blue
  Safari: { label: "Safari", color: "#2563EB" }, // Safari blue
  Opera: { label: "Opera", color: "#FF1B2D" }, // Opera red
};
