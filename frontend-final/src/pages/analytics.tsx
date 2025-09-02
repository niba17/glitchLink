// frontend-final/src/pages/analytics.tsx
import { DateRangeChartLineInteractive } from "@/features/analytics/components/charts/dateRangeLineChart";
import DateRangePicker from "@/components/ui/date-range-picker";
import React from "react";
// Perbaiki kapitalisasi import di sini
import { DonutPieChartCardContainer } from "@/features/analytics/components/containers/donutPieChartCardContainer";

export default function analyticsPage() {
  return (
    <div className="bg-zinc-950 min-h-screen px-[50px] py-5 space-y-[10px]">
      <section>
        <DonutPieChartCardContainer />
      </section>
      <section>
        <DateRangeChartLineInteractive />
      </section>
    </div>
  );
}
