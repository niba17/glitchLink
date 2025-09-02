// frontend-final/src/features/analytics/components/containers/donutPieChartCardContainer.tsx
"use client";

import * as React from "react";
import { DateRange } from "react-day-picker";
import { DonutPieChartUI } from "../cards/donutPieChartUI";
import {
  DeviceKey,
  OSKey,
  BrowserKey,
} from "@/features/analytics/config/chartConfig";

// Dummy data
const initialDeviceData: { key: DeviceKey; clicks: number }[] = [
  { key: "Desktop", clicks: 400 },
  { key: "Mobile", clicks: 250 },
  { key: "Tablet", clicks: 150 },
];
const initialOSData: { key: OSKey; clicks: number }[] = [
  { key: "Windows", clicks: 320 },
  { key: "macOS", clicks: 210 },
  { key: "Linux", clicks: 150 },
  { key: "Android", clicks: 280 },
  { key: "iOS", clicks: 190 },
];
const initialBrowserData: { key: BrowserKey; clicks: number }[] = [
  { key: "Chrome", clicks: 500 },
  { key: "Firefox", clicks: 300 },
  { key: "Edge", clicks: 200 },
  { key: "Safari", clicks: 150 },
  { key: "Opera", clicks: 100 },
];

export default function DonutPieChartCardContainer() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const [activeDevices, setActiveDevices] = React.useState<DeviceKey[]>([
    "Desktop",
    "Mobile",
    "Tablet",
  ]);
  const [activeOS, setActiveOS] = React.useState<OSKey[]>([
    "Windows",
    "macOS",
    "Linux",
    "Android",
    "iOS",
  ]);
  const [activeBrowsers, setActiveBrowsers] = React.useState<BrowserKey[]>([
    "Chrome",
    "Firefox",
    "Edge",
    "Safari",
    "Opera",
  ]);

  const toggleHandler = <T extends string>(
    key: T,
    active: T[],
    setActive: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    if (active.includes(key)) {
      setActive(active.filter((k) => k !== key));
    } else {
      setActive([...active, key]);
    }
  };

  const memoizedToggleDevice = React.useCallback(
    (key: DeviceKey) => toggleHandler(key, activeDevices, setActiveDevices),
    [activeDevices]
  );

  const memoizedToggleOS = React.useCallback(
    (key: OSKey) => toggleHandler(key, activeOS, setActiveOS),
    [activeOS]
  );

  const memoizedToggleBrowser = React.useCallback(
    (key: BrowserKey) => toggleHandler(key, activeBrowsers, setActiveBrowsers),
    [activeBrowsers]
  );

  return (
    <DonutPieChartUI
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      deviceData={initialDeviceData}
      osData={initialOSData}
      browserData={initialBrowserData}
      activeDevices={activeDevices}
      activeOS={activeOS}
      activeBrowsers={activeBrowsers}
      onToggleDevice={memoizedToggleDevice}
      onToggleOS={memoizedToggleOS}
      onToggleBrowser={memoizedToggleBrowser}
    />
  );
}
