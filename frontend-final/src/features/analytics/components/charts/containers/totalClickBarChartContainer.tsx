import React from "react";
import {
  TotalClickChartDataItem,
  BrowserKey,
  DeviceKey,
  OSKey,
} from "@/features/analytics/types/type";
import { TotalClickBarChartUI } from "@/features/analytics/components/charts/ui/totalClickBarChartUI";
import { chartConfig } from "@/features/analytics/config/chartConfig";
import {
  allKeys,
  referrers,
} from "@/features/analytics/constants/analyticsKeys";

// Capitalize helper
const capitalize = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Logika transformasi khusus chart
const getCombinedChartData = (clicks: any[]): TotalClickChartDataItem[] => {
  const counts = clicks.reduce((acc, click) => {
    if (click.browser)
      acc[capitalize(click.browser)] =
        (acc[capitalize(click.browser)] || 0) + 1;
    if (click.device)
      acc[capitalize(click.device)] = (acc[capitalize(click.device)] || 0) + 1;
    if (click.os)
      acc[capitalize(click.os)] = (acc[capitalize(click.os)] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter: jangan masukkan referrers
  return allKeys
    .filter((key) => !referrers.includes(key as any))
    .map((key) => ({
      name: key,
      clicks: counts[key] || 0,
      fill:
        chartConfig[key as BrowserKey | DeviceKey | OSKey]?.color || "#e5e5e5",
    }));
};

interface TotalClickBarChartContainerProps {
  clicksData: any[];
}

export function TotalClickBarChartContainer({
  clicksData,
}: TotalClickBarChartContainerProps) {
  const chartData = getCombinedChartData(clicksData);
  return <TotalClickBarChartUI chartData={chartData} />;
}
