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
import { calculateTotal } from "@/features/analytics/utils/chartHelpers";
import {
  devices,
  browsers,
  osList,
} from "@/features/analytics/constants/analyticsKeys";
import { mapDropdown } from "@/features/analytics/utils/analyticsHelpers";

type ChartKey = DeviceKey | BrowserKey | OSKey;

export function LineCardContainer() {
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

  const allKeys = [...devices, ...browsers, ...osList] as ChartKey[];

  const chartData = React.useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return chartDataSample;

    // Map data sample untuk lookup cepat
    const sampleMap = new Map(
      chartDataSample.map((d) => [d.date, d] as [string, ChartDataItem])
    );

    const allDates = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to,
    });

    return allDates.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const found = sampleMap.get(dateStr);

      // Semua keys selalu ada
      const item: ChartDataItem = { date: dateStr } as ChartDataItem;

      allKeys.forEach((key) => {
        item[key] = found && typeof found[key] === "number" ? found[key] : 0;
      });

      return item;
    });
  }, [dateRange, allKeys]);

  const total = React.useMemo(
    () => calculateTotal(chartData, allKeys),
    [chartData]
  );

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

  // -----------------------
  // Helper untuk mapping dropdown
  // -----------------------
  const mapDropdown = <T extends ChartKey>(
    keys: T[],
    active: T[],
    setActive: React.Dispatch<React.SetStateAction<T[]>>,
    rendered: T[],
    setRendered: React.Dispatch<React.SetStateAction<T[]>>
  ) =>
    keys.map((key) => ({
      key,
      label: chartConfig[key].label,
      color: chartConfig[key].color,
      value: total[key] || 0,
      checked: active.includes(key),
      onToggle: () => toggleLine(key, active, setActive, rendered, setRendered),
    }));

  const dropdowns = {
    devices: mapDropdown(
      devices,
      activeDevices,
      setActiveDevices,
      renderedDevices,
      setRenderedDevices
    ),
    osList: mapDropdown(
      osList,
      activeOS,
      setActiveOS,
      renderedOS,
      setRenderedOS
    ),
    browsers: mapDropdown(
      browsers,
      activeBrowsers,
      setActiveBrowsers,
      renderedBrowsers,
      setRenderedBrowsers
    ),
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
