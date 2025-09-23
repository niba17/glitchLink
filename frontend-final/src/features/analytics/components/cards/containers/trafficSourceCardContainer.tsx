import React from "react";
import { TrafficSourceCardUI } from "../ui/trafficSourceCardUI";
import { useUserLinkAnalytics } from "@/features/analytics/hooks/useUserLinkAnalitics";
import { chartConfig } from "@/features/analytics/config/chartConfig";
import { TotalClickChartDataItem } from "@/features/analytics/types/type";

// hanya referrer yang kita tampilkan
const REFERRER_KEYS = [
  "Instagram",
  "WhatsApp",
  "Facebook",
  "LinkedIn",
  "GitHub",
  "Direct",
];

interface TrafficSourceCardContainerProps {
  shortlinkId?: number;
}

// hitung data chart berdasarkan referrer
const getTrafficSourceData = (clicks: any[]): TotalClickChartDataItem[] => {
  const counts: Record<string, number> = {};

  clicks.forEach((click) => {
    let ref = "Direct"; // default
    const userAgent = click.referrer?.toLowerCase() || "";

    if (userAgent.includes("instagram")) ref = "Instagram";
    else if (userAgent.includes("whatsapp")) ref = "WhatsApp";
    else if (userAgent.includes("facebook")) ref = "Facebook";
    else if (userAgent.includes("linkedin")) ref = "LinkedIn";
    else if (userAgent.includes("github")) ref = "GitHub";

    counts[ref] = (counts[ref] || 0) + 1;
  });

  return REFERRER_KEYS.filter((key) => counts[key] > 0).map((key) => ({
    name: key,
    clicks: counts[key],
    fill: chartConfig[key as keyof typeof chartConfig]?.color || "#e5e5e5",
  }));
};

export function TrafficSourceCardContainer({
  shortlinkId,
}: TrafficSourceCardContainerProps) {
  const { analyticsData, isLoading } = useUserLinkAnalytics(shortlinkId);

  if (isLoading) {
    return (
      <h1 className="text-md font-semibold text-stone-200 animate-pulse">
        Loading traffic sources...
      </h1>
    );
  }

  const clicksData = analyticsData?.clicks ?? [];
  const chartData = getTrafficSourceData(clicksData);
  const totalClicks = clicksData.length;

  return <TrafficSourceCardUI clicks={totalClicks} chartData={chartData} />;
}
