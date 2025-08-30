import { DateRangeChartLineInteractive } from "@/features/analytics/components/charts/dateRangeLineChart";
import DateRangePicker from "@/components/ui/date-range-picker";
import React from "react";
import LinkTotalClickCardWithBackground from "@/features/analytics/components/card/linkTotalClickCard";

export default function analyticsPage() {
  return (
    <div className="bg-zinc-950 min-h-screen px-[50px] py-5 space-y-[10px]">
      <section>
        <LinkTotalClickCardWithBackground />
      </section>
      <section>
        <DateRangeChartLineInteractive />
      </section>
    </div>
  );
}
