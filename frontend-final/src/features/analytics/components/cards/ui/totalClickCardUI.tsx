// Lokasi: frontend-final\src\features\analytics\components\cards\ui\totalClickCardUI.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { chartConfig } from "@/features/analytics/config/chartConfig";
import { BrowserKey, DeviceKey, OSKey } from "@/features/analytics/types/type";

interface ChartDataItem {
  name: string;
  visitors: number;
  fill: string;
}

interface TotalClickCardUIProps {
  clicks: number;
  chartData: ChartDataItem[];
}

export function TotalClickCardUI({ clicks, chartData }: TotalClickCardUIProps) {
  return (
    <Card className="bg-foreground p-0">
      <CardHeader className="pb-0 text-lg font-semibold text-accent">
        Total Clicks : {clicks.toLocaleString()}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div>
            <div>
              <div className="flex flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  layout="vertical"
                  margin={{
                    left: 5,
                    right: 5,
                  }}
                >
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => {
                      const label =
                        chartConfig[value as BrowserKey | DeviceKey | OSKey]
                          ?.label ?? value;
                      // Pangkas label jika terlalu panjang
                      if (label.length > 10) {
                        return `${label.substring(0, 10)}...`;
                      }
                      return label;
                    }}
                    interval={0}
                  />
                  <XAxis dataKey="visitors" type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={({ payload }) => (
                      <div className="w-[150px] bg-zinc-800 bg-opacity-70 p-2 text-accent">
                        {payload?.map((entry) => (
                          <div
                            key={entry.name}
                            className="flex justify-between items-center"
                          >
                            <span className="flex items-center space-x-1">
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{
                                  backgroundColor:
                                    chartConfig[
                                      entry.name as
                                        | BrowserKey
                                        | DeviceKey
                                        | OSKey
                                    ]?.color,
                                }}
                              />
                              <span>
                                {chartConfig[
                                  entry.name as BrowserKey | DeviceKey | OSKey
                                ]?.label ?? entry.name}
                              </span>
                            </span>
                            <span>{entry.value?.toLocaleString() ?? 0}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  />
                  <Bar dataKey="visitors" layout="vertical" />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
