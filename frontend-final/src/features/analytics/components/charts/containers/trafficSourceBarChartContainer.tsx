import React from "react";
import { TotalClickChartDataItem } from "@/features/analytics/types/type";
import { TrafficSourceBarChartUI } from "../ui/trafficSourceBarChartUI";

interface TrafficSourceBarChartContainerProps {
  chartData: TotalClickChartDataItem[];
}

export function TrafficSourceBarChartContainer({
  chartData,
}: TrafficSourceBarChartContainerProps) {
  return <TrafficSourceBarChartUI chartData={chartData} />;
}
