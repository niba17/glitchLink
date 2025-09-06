// Lokasi: frontend-final\src\features\analytics\components\cards\containers\trafficSpikeCardContainer.tsx
"use client";

import React from "react";
import { TrafficSourceCardUI } from "../ui/trafficSourceCardUI";
import {
  useUserLinkAnalytics,
  ClickEvent,
} from "../../../hooks/useUserLinkAnalitics";

interface TrafficSourceCardContainerProps {
  shortlinkId?: number; // Perbarui tipe data di sini
}

export function TrafficSourceCardContainer({
  shortlinkId,
}: TrafficSourceCardContainerProps) {
  const { analyticsData, isLoading, isError } =
    useUserLinkAnalytics(shortlinkId);

  const calculateTrafficSpike = () => {
    if (
      !analyticsData ||
      !Array.isArray(analyticsData.clicks) ||
      analyticsData.clicks.length === 0
    ) {
      return 0;
    }

    const dailyClicks: { [key: string]: number } = {};
    analyticsData.clicks.forEach((click: ClickEvent) => {
      const date = new Date(click.timestamp).toLocaleDateString();
      dailyClicks[date] = (dailyClicks[date] || 0) + 1;
    });

    const maxClicks = Math.max(...Object.values(dailyClicks));

    return isFinite(maxClicks) ? maxClicks : 0;
  };

  const spikeValue = calculateTrafficSpike();

  if (isLoading) {
    return (
      <h1 className="text-md font-semibold text-stone-200">
        <span className="animate-pulse">Loading spike data...</span>
      </h1>
    );
  }

  if (isError) {
    return (
      <h1 className="text-md font-semibold text-stone-200">
        Failed to load spike data.
      </h1>
    );
  }

  return <TrafficSourceCardUI clicks={spikeValue} />;
}
