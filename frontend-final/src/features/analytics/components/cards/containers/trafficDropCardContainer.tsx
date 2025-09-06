// Lokasi: frontend-final\src\features\analytics\components\cards\containers\trafficDropCardContainer.tsx
"use client";

import React from "react";
import { TrafficDropCardUI } from "../ui/trafficDropCardUI";
import {
  useUserLinkAnalytics,
  LinkAnalyticsResponse,
} from "../../../hooks/useUserLinkAnalitics";

interface TrafficDropCardContainerProps {
  shortlinkId?: number; // Tambahkan properti shortlinkId di sini
}

export function TrafficDropCardContainer({
  shortlinkId,
}: TrafficDropCardContainerProps) {
  const { analyticsData, isLoading, isError } =
    useUserLinkAnalytics(shortlinkId);

  // Logika untuk menghitung traffic drop
  const calculateTrafficDrop = (data: LinkAnalyticsResponse) => {
    // Implementasi logika Anda di sini.
    // Contoh sederhana: Mengambil jumlah klik total.
    return data?.clicksCount ?? 0;
  };

  if (isLoading) {
    return (
      <h1 className="text-md font-semibold text-stone-200">
        <span className="animate-pulse">Loading drop data...</span>
      </h1>
    );
  }

  if (isError) {
    return (
      <h1 className="text-md font-semibold text-stone-200">
        Failed to load drop data.
      </h1>
    );
  }

  const clicks = analyticsData ? calculateTrafficDrop(analyticsData) : 0;

  return <TrafficDropCardUI clicks={clicks} />;
}
