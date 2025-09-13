import React from "react";
import { TotalClickCardUI } from "../ui/totalClickCardUI";
import { useUserLinkAnalytics } from "@/features/analytics/hooks/useUserLinkAnalitics";
import { chartConfig } from "@/features/analytics/config/chartConfig";
import { allKeys } from "@/features/analytics/constants/analyticsKeys";
import { BrowserKey, DeviceKey, OSKey } from "@/features/analytics/types/type";

interface TotalClickCardContainerProps {
  shortlinkId?: number;
}

const capitalize = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getCombinedChartData = (clicks: any[]) => {
  const counts = clicks.reduce((acc, click) => {
    if (click.browser)
      acc[capitalize(click.browser)] =
        (acc[capitalize(click.browser)] || 0) + 1;
    if (click.device)
      acc[capitalize(click.device)] = (acc[capitalize(click.device)] || 0) + 1;
    if (click.os)
      acc[capitalize(click.os)] = (acc[capitalize(click.os)] || 0) + 1;
    return acc;
  }, {});

  const combinedData = allKeys.map((key) => {
    const clicks = counts[key] || 0;
    return {
      name: key,
      clicks: clicks,
      fill:
        chartConfig[key as BrowserKey | DeviceKey | OSKey]?.color || "#e5e5e5",
    };
  });

  return combinedData;
};

export function TotalClickCardContainer({
  shortlinkId,
}: TotalClickCardContainerProps) {
  const { analyticsData, isLoading } = useUserLinkAnalytics(shortlinkId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const clicksCount = analyticsData?.clicksCount ?? 0;
  const clicksData = analyticsData?.clicks ?? [];
  const chartData = getCombinedChartData(clicksData);

  return <TotalClickCardUI clicks={clicksCount} chartData={chartData} />;
}
