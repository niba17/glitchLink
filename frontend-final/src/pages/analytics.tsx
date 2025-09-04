// frontend-final/src/pages/analytics.tsx
import React from "react";
import { DonutPieCardContainer } from "@/features/analytics/components/containers/donutPieCardContainer";
import { AllLineChartContainer } from "@/features/analytics/components/containers/allLineChartContainer";

export default function AnalyticsPage() {
  return (
    <div className="bg-zinc-950 min-h-screen px-[50px] py-5 space-y-[10px]">
      <section>
        <DonutPieCardContainer />
      </section>
      <section>
        <AllLineChartContainer />
      </section>
    </div>
  );
}
