"use client";

import * as React from "react";
import { DonutPieCardUI } from "../cards/donutPieCardUI";
import { DateRange } from "react-day-picker";
import { isWithinInterval, parseISO } from "date-fns";
import {
  DeviceKey,
  OSKey,
  BrowserKey,
} from "@/features/analytics/config/chartConfig";
import { chartDataSample } from "@/features/analytics/samples/dataSamples";

export function DonutPieCardContainer() {
  // Mengagregasi data untuk mendapatkan tanggal awal dan akhir
  const initialDateRange = React.useMemo(() => {
    if (chartDataSample.length === 0) {
      return { from: new Date(), to: new Date() };
    }
    const dates = chartDataSample
      .map((day) => parseISO(day.date))
      .sort((a, b) => a.getTime() - b.getTime());
    return {
      from: dates[0],
      to: dates[dates.length - 1],
    };
  }, []);

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    initialDateRange
  );

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

  // useMemo untuk data chart
  const data = React.useMemo(() => {
    const filteredData = chartDataSample.filter((day) => {
      if (!dateRange || !dateRange.from || !dateRange.to) {
        return false;
      }
      const date = parseISO(day.date);
      return isWithinInterval(date, {
        start: dateRange.from,
        end: dateRange.to,
      });
    });

    const deviceData = [
      { key: "Desktop" as DeviceKey, clicks: 0 },
      { key: "Mobile" as DeviceKey, clicks: 0 },
      { key: "Tablet" as DeviceKey, clicks: 0 },
    ];
    const osData = [
      { key: "Windows" as OSKey, clicks: 0 },
      { key: "macOS" as OSKey, clicks: 0 },
      { key: "Linux" as OSKey, clicks: 0 },
      { key: "Android" as OSKey, clicks: 0 },
      { key: "iOS" as OSKey, clicks: 0 },
    ];
    const browserData = [
      { key: "Chrome" as BrowserKey, clicks: 0 },
      { key: "Firefox" as BrowserKey, clicks: 0 },
      { key: "Edge" as BrowserKey, clicks: 0 },
      { key: "Safari" as BrowserKey, clicks: 0 },
      { key: "Opera" as BrowserKey, clicks: 0 },
    ];

    filteredData.forEach((day) => {
      Object.keys(day).forEach((key) => {
        if (key !== "date") {
          const value = day[key];
          const deviceItem = deviceData.find((d) => d.key === key);
          if (deviceItem) {
            deviceItem.clicks += typeof value === "number" ? value : 0;
          }
          const osItem = osData.find((o) => o.key === key);
          if (osItem) {
            osItem.clicks += typeof value === "number" ? value : 0;
          }
          const browserItem = browserData.find((b) => b.key === key);
          if (browserItem) {
            browserItem.clicks += typeof value === "number" ? value : 0;
          }
        }
      });
    });

    return {
      deviceData,
      osData,
      browserData,
    };
  }, [dateRange]);

  // Handler toggle memoized
  const onToggleDevice = React.useCallback((key: DeviceKey) => {
    setActiveDevices((prevActiveKeys) =>
      prevActiveKeys.includes(key)
        ? prevActiveKeys.filter((k) => k !== key)
        : [...prevActiveKeys, key]
    );
  }, []);

  const onToggleOS = React.useCallback((key: OSKey) => {
    setActiveOS((prevActiveKeys) =>
      prevActiveKeys.includes(key)
        ? prevActiveKeys.filter((k) => k !== key)
        : [...prevActiveKeys, key]
    );
  }, []);

  const onToggleBrowser = React.useCallback((key: BrowserKey) => {
    setActiveBrowsers((prevActiveKeys) =>
      prevActiveKeys.includes(key)
        ? prevActiveKeys.filter((k) => k !== key)
        : [...prevActiveKeys, key]
    );
  }, []);

  const onDateRangeChange = React.useCallback(
    (range: DateRange | undefined) => {
      setDateRange(range);
    },
    []
  );

  return (
    <DonutPieCardUI
      dateRange={dateRange}
      onDateRangeChange={onDateRangeChange}
      deviceData={data.deviceData}
      osData={data.osData}
      browserData={data.browserData}
      activeDevices={activeDevices}
      activeOS={activeOS}
      activeBrowsers={activeBrowsers}
      onToggleDevice={onToggleDevice}
      onToggleOS={onToggleOS}
      onToggleBrowser={onToggleBrowser}
    />
  );
}
