// frontend-final/src/features/analytics/components/charts/DeviceDonutPieChart.tsx
"use client";

import * as React from "react";
import { Pie, PieChart, Cell, Label, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

export const description = "A donut chart with text";

const chartData = [
  { key: "desktop", visitors: 400 },
  { key: "mobile", visitors: 250 },
  { key: "tablet", visitors: 150 },
];

type DeviceKey = "desktop" | "mobile" | "tablet";

const chartConfig: Record<DeviceKey, { label: string; color: string }> = {
  desktop: { label: "Desktop", color: "#1ee85a" },
  mobile: { label: "Mobile", color: "#e81e54" },
  tablet: { label: "Tablet", color: "#4285F4" },
};

export function DeviceDonutPieChart() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold text-stone-200 mb-4">Device</h2>

      {/* Penting: tambahkan tinggi tetap */}
      <ChartContainer config={chartConfig} className="mx-auto h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <ChartTooltip
              content={({ payload }) => (
                <div className="w-[150px] bg-zinc-900/80 p-2 text-stone-200">
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
                              chartConfig[entry.name as DeviceKey]?.color ??
                              "rgb(231 229 228)",
                          }}
                        />
                        <span>
                          {chartConfig[entry.name as DeviceKey]?.label ??
                            entry.name}
                        </span>
                      </span>
                      <span>{entry.value?.toLocaleString() ?? "0"}</span>
                    </div>
                  ))}
                </div>
              )}
            />

            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="key"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={
                    chartConfig[entry.key as DeviceKey]?.color ??
                    "rgb(231 229 228)"
                  }
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-stone-200 text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-stone-400"
                        >
                          Clicks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      <p className="text-sm text-stone-400 mt-4">
        Showing Click by device for the last 6 months
      </p>
    </div>
  );
}
