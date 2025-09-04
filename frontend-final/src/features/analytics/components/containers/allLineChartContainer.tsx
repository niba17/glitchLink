"use client";

import * as React from "react";
import { AllLineChartUI } from "../charts/allLineChartUI";
import { eachDayOfInterval, format } from "date-fns";
import { type DateRange } from "react-day-picker";
import {
  chartConfig,
  DeviceKey,
  OSKey,
  BrowserKey,
} from "@/features/analytics/config/chartConfig";
import {
  chartDataSample,
  ChartDataItem,
} from "@/features/analytics/samples/dataSamples";

type ChartKey = DeviceKey | BrowserKey | OSKey;

export function AllLineChartContainer() {
  const devices: DeviceKey[] = ["Desktop", "Mobile", "Tablet"];
  const browsers: BrowserKey[] = [
    "Chrome",
    "Firefox",
    "Edge",
    "Safari",
    "Opera",
  ];

  const onToggleDevice = (d: DeviceKey) => {
    toggleLine(
      d,
      activeDevices,
      setActiveDevices,
      renderedDevices,
      setRenderedDevices
    );
  };

  const onToggleBrowser = (b: BrowserKey) => {
    toggleLine(
      b,
      activeBrowsers,
      setActiveBrowsers,
      renderedBrowsers,
      setRenderedBrowsers
    );
  };

  const onToggleOS = (o: OSKey) => {
    toggleLine(o, activeOS, setActiveOS, renderedOS, setRenderedOS);
  };

  const osList: OSKey[] = ["Windows", "macOS", "Linux", "Android", "iOS"];

  const [activeDevices, setActiveDevices] = React.useState<DeviceKey[]>([
    ...devices,
  ]);
  const [activeBrowsers, setActiveBrowsers] = React.useState<BrowserKey[]>([
    ...browsers,
  ]);
  const [activeOS, setActiveOS] = React.useState<OSKey[]>([...osList]);

  const [renderedDevices, setRenderedDevices] = React.useState<DeviceKey[]>([
    ...devices,
  ]);
  const [renderedBrowsers, setRenderedBrowsers] = React.useState<BrowserKey[]>([
    ...browsers,
  ]);
  const [renderedOS, setRenderedOS] = React.useState<OSKey[]>([...osList]);

  // --- Ambil tanggal awal & akhir dari sample ---
  const sampleDates = chartDataSample.map((d) => new Date(d.date));
  const minDate = new Date(Math.min(...sampleDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...sampleDates.map((d) => d.getTime())));

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: minDate,
    to: maxDate,
  });

  // --- chartData calculation ---
  const chartData = React.useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return chartDataSample;
    const allDates = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to,
    });
    return allDates.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const found = chartDataSample.find((d) => d.date === dateStr);
      return ([...devices, ...browsers, ...osList] as ChartKey[]).reduce(
        (acc, key) => {
          acc[key] = found && typeof found[key] === "number" ? found[key] : 0;
          return acc;
        },
        { date: dateStr } as ChartDataItem
      );
    });
  }, [dateRange]);

  const total = React.useMemo(() => {
    return ([...devices, ...browsers, ...osList] as ChartKey[]).reduce(
      (acc, key) => {
        acc[key] = chartData.reduce(
          (sum, curr) => sum + (typeof curr[key] === "number" ? curr[key] : 0),
          0
        );
        return acc;
      },
      {} as Record<ChartKey, number>
    );
  }, [chartData]);

  // ---- toggle handlers ----
  const toggleLine = <T extends ChartKey>(
    key: T,
    active: T[],
    setActive: React.Dispatch<React.SetStateAction<T[]>>,
    rendered: T[],
    setRendered: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    if (active.includes(key)) {
      setActive((prev) => prev.filter((k) => k !== key));
    } else {
      setActive((prev) => [...prev, key]);
      if (!rendered.includes(key)) setRendered((prev) => [...prev, key]);
    }
  };

  return (
    <AllLineChartUI
      devices={devices}
      browsers={browsers}
      osList={osList}
      dateRange={dateRange}
      setDateRange={setDateRange}
      chartData={chartData}
      total={total}
      activeDevices={activeDevices}
      activeBrowsers={activeBrowsers}
      activeOS={activeOS}
      renderedDevices={renderedDevices}
      renderedBrowsers={renderedBrowsers}
      renderedOS={renderedOS}
      onToggleDevice={onToggleDevice}
      onToggleBrowser={onToggleBrowser}
      onToggleOS={onToggleOS}
    />
  );
}
