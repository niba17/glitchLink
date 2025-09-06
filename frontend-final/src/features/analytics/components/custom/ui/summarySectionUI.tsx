"use client";

import React from "react";
import { TotalClickCardContainer } from "../../cards/containers/totalClickCardContainer";
import { TrafficSourceCardContainer } from "../../cards/containers/trafficSourceCardContainer";
import { BounceRateCardContainer } from "../../cards/containers/bounceRateCardContainer";
import { UserLink } from "@/features/links/types/type";

interface SummarySectionUIProps {
  selectedShortlink: UserLink | undefined;
}

export function SummarySectionUI({ selectedShortlink }: SummarySectionUIProps) {
  if (!selectedShortlink) {
    return (
      <h1 className="text-md font-semibold text-stone-200">
        <span className="animate-pulse">Loading analytics...</span>
      </h1>
    );
  }

  return (
    <div className="flex flex-col space-y-5">
      <div className="grid grid-cols-3 justify-center space-x-5">
        <TotalClickCardContainer shortlinkId={selectedShortlink.id} />
        <BounceRateCardContainer shortlinkId={selectedShortlink.id} />
        <TrafficSourceCardContainer shortlinkId={selectedShortlink.id} />
      </div>
    </div>
  );
}
