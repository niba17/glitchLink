"use client";

import * as React from "react";
import { LineCardUI } from "@/features/analytics/components/cards/lineCardUI";
import { AllLineChartContainer } from "@/features/analytics/components/containers/allLineChartContainer";
import { DeviceKey, BrowserKey, OSKey } from "@/features/analytics/types/type";
import { eachDayOfInterval, format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  chartDataSample,
  ChartDataItem,
} from "@/features/analytics/samples/dataSamples";
import { chartConfig } from "@/features/analytics/config/chartConfig";

type ChartKey = DeviceKey | BrowserKey | OSKey;

export function LineCardContainer() {
  const devices: DeviceKey[] = ["Desktop", "Mobile", "Tablet"];
  const browsers: BrowserKey[] = [
    "Chrome",
    "Firefox",
    "Edge",
    "Safari",
    "Opera",
  ];
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

  const sampleDates = chartDataSample.map((d) => new Date(d.date));
  const minDate = new Date(Math.min(...sampleDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...sampleDates.map((d) => d.getTime())));

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: minDate,
    to: maxDate,
  });

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

  const dropdowns = {
    devices: devices.map((key) => ({
      key,
      label: chartConfig[key].label,
      color: chartConfig[key].color,
      value: total[key] || 0,
      checked: activeDevices.includes(key),
      onToggle: () =>
        toggleLine(
          key,
          activeDevices,
          setActiveDevices,
          renderedDevices,
          setRenderedDevices
        ),
    })),
    osList: osList.map((key) => ({
      key,
      label: chartConfig[key].label,
      color: chartConfig[key].color,
      value: total[key] || 0,
      checked: activeOS.includes(key),
      onToggle: () =>
        toggleLine(key, activeOS, setActiveOS, renderedOS, setRenderedOS),
    })),
    browsers: browsers.map((key) => ({
      key,
      label: chartConfig[key].label,
      color: chartConfig[key].color,
      value: total[key] || 0,
      checked: activeBrowsers.includes(key),
      onToggle: () =>
        toggleLine(
          key,
          activeBrowsers,
          setActiveBrowsers,
          renderedBrowsers,
          setRenderedBrowsers
        ),
    })),
  };

  return (
    <LineCardUI
      dateRange={dateRange}
      setDateRange={setDateRange}
      dropdowns={dropdowns}
    >
      <AllLineChartContainer
        chartData={chartData}
        activeDevices={activeDevices}
        activeBrowsers={activeBrowsers}
        activeOS={activeOS}
        renderedDevices={renderedDevices}
        renderedBrowsers={renderedBrowsers}
        renderedOS={renderedOS}
      />
    </LineCardUI>
  );
}
