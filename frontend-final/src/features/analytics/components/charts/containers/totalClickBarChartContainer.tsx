"use client";

import React from "react";
import { TotalClickChartDataItem } from "@/features/analytics/types/type";
import { TotalClickBarChartUI } from "@/features/analytics/components/charts/ui/totalClickBarChartUI";

interface TotalClickBarChartContainerProps {
  chartData: TotalClickChartDataItem[];
}

export function TotalClickBarChartContainer({
  chartData,
}: TotalClickBarChartContainerProps) {
  return <TotalClickBarChartUI chartData={chartData} />;
}
