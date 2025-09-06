"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { analyticService } from "../services/analyticService";

export interface ClickEvent {
  id: number;
  timestamp: string;
}

export interface LinkAnalyticsResponse {
  clicksCount: number;
  clicks: ClickEvent[];
  // properti lain yang mungkin ada
}

export function useUserLinkAnalytics(shortlinkId?: number) {
  const token = useAuthStore((s) => s.token);

  const query = useQuery<LinkAnalyticsResponse, Error>({
    queryKey: ["linkAnalytics", shortlinkId, token],
    queryFn: async () => {
      if (!token || typeof shortlinkId === "undefined") {
        throw new Error("User not authenticated or shortlink ID is missing");
      }
      return analyticService.getLinkAnalytics(shortlinkId, token);
    },
    enabled: !!token && typeof shortlinkId !== "undefined",
  });

  return {
    ...query,
    analyticsData: query.data,
  };
}
