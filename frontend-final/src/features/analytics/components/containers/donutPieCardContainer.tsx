"use client";

import * as React from "react";
import { DonutPieCardUI } from "../cards/donutPieCardUI";
import { DateRange } from "react-day-picker";
import { isWithinInterval, parseISO } from "date-fns";
import { DeviceKey, BrowserKey, OSKey } from "@/features/analytics/types/type";
import { chartDataSample } from "@/features/analytics/samples/dataSamples";
import { useActiveKeys } from "@/features/analytics/hooks/useActiveKeys";
import {
  devices,
  browsers,
  osList,
} from "@/features/analytics/constants/analyticsKeys";

export function DonutPieCardContainer() {
  const { active, onToggle } = useActiveKeys();

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

    const deviceData = [...devices.map((key) => ({ key, clicks: 0 }))];
    const osData = [...osList.map((key) => ({ key, clicks: 0 }))];
    const browserData = [...browsers.map((key) => ({ key, clicks: 0 }))];

    filteredData.forEach((day) => {
      Object.keys(day).forEach((key) => {
        if (key !== "date") {
          const value = day[key as keyof typeof day];
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

  const onDateRangeChange = React.useCallback(
    (range: DateRange | undefined) => {
      setDateRange(range);
    },
    []
  );

  // Perbaikan: Gunakan useCallback untuk memoize fungsi onToggle
  const onToggleDevice = React.useCallback(
    (key: DeviceKey) => onToggle("devices")(key),
    [onToggle]
  );
  const onToggleOS = React.useCallback(
    (key: OSKey) => onToggle("osList")(key),
    [onToggle]
  );
  const onToggleBrowser = React.useCallback(
    (key: BrowserKey) => onToggle("browsers")(key),
    [onToggle]
  );

  return (
    <DonutPieCardUI
      dateRange={dateRange}
      onDateRangeChange={onDateRangeChange}
      deviceData={data.deviceData}
      osData={data.osData}
      browserData={data.browserData}
      activeDevices={active.devices as DeviceKey[]}
      activeOS={active.osList as OSKey[]}
      activeBrowsers={active.browsers as BrowserKey[]}
      onToggleDevice={onToggleDevice}
      onToggleOS={onToggleOS}
      onToggleBrowser={onToggleBrowser}
    />
  );
}
