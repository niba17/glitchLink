import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { TotalClickChartDataItem } from "@/features/analytics/types/type";
import { TrafficSourceBarChartContainer } from "../../charts/containers/trafficSourceBarChartContainer";

interface TrafficSourceCardUIProps {
  clicks: number;
  chartData: TotalClickChartDataItem[];
}

export function TrafficSourceCardUI({
  clicks,
  chartData,
}: TrafficSourceCardUIProps) {
  return (
    <Card className="bg-foreground p-5">
      <CardHeader className="p-0 text-lg font-semibold text-accent">
        Traffic Sources: {clicks.toLocaleString()}
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col items-start text-sm gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <TrafficSourceBarChartContainer chartData={chartData} />
        </div>
      </CardContent>
    </Card>
  );
}
