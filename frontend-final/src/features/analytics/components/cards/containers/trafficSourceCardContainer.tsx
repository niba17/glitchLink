import React from "react";
import { useUserLinkAnalytics } from "@/features/analytics/hooks/useUserLinkAnalitics";
import { TrafficSourceCardUI } from "../ui/trafficSourceCardUI";

interface TrafficSourceCardContainerProps {
  shortlinkId?: number;
}

export function TrafficSourceCardContainer({
  shortlinkId,
}: TrafficSourceCardContainerProps) {
  const { analyticsData, isLoading, isError } =
    useUserLinkAnalytics(shortlinkId);

  const clicksData = analyticsData?.clicks ?? [];

  return (
    <TrafficSourceCardUI
      clicksData={clicksData}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
