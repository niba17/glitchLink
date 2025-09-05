"use client";

import React from "react";
import { DonutPieCardContainer } from "@/features/analytics/components/containers/donutPieCardContainer";
import { LineCardContainer } from "@/features/analytics/components/containers/lineCardContainer";
import { SummarySectionContainer } from "@/features/analytics/components/containers/summarySectionContainer";

export default function AnalyticsPage() {
  return (
    <div className="bg-zinc-950 min-h-screen px-[50px] py-5 space-y-5">
      <section>
        <SummarySectionContainer />
      </section>
      <section>
        <DonutPieCardContainer />
      </section>
      <section>
        <LineCardContainer />
      </section>
    </div>
  );
}
