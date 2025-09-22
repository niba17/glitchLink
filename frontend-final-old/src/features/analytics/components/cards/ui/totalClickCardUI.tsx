import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { TotalClickBarChartContainer } from "@/features/analytics/components/charts/containers/totalClickBarChartContainer";
import { TotalClickChartDataItem } from "@/features/analytics/types/type";

interface TotalClickCardUIProps {
  clicks: number;
  chartData: TotalClickChartDataItem[];
}

export function TotalClickCardUI({ clicks, chartData }: TotalClickCardUIProps) {
  return (
    <Card className="bg-foreground p-5">
      <CardHeader className="p-0 text-lg font-semibold text-accent">
        Total clicks : {clicks.toLocaleString()}
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div>
            <div>
              <div className="flex flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <TotalClickBarChartContainer chartData={chartData} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
