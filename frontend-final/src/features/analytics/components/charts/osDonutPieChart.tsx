// frontend-final/src/features/analytics/components/charts/OSDonutPieChart.tsx
"use client";

import * as React from "react";
import { Pie, PieChart, Cell, Label, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

export const description = "A donut chart showing OS distribution";

const chartData = [
  { os: "Windows", visitors: 320 },
  { os: "macOS", visitors: 210 },
  { os: "Linux", visitors: 150 },
  { os: "Android", visitors: 280 },
  { os: "iOS", visitors: 190 },
];

type OSKey = "Windows" | "macOS" | "Linux" | "Android" | "iOS";

const chartConfig: Record<OSKey, { label: string; color: string }> = {
  Windows: { label: "Windows", color: "#00BCF2" },
  macOS: { label: "macOS", color: "#999999" },
  Linux: { label: "Linux", color: "#FCC624" },
  Android: { label: "Android", color: "#3DDC84" },
  iOS: { label: "iOS", color: "#A2AAAD" },
};

export function OSDonutPieChart() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold text-stone-200 mb-4">
        Operating System
      </h2>

      {/* Penting: tinggi tetap agar chart muncul */}
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
                              chartConfig[entry.name as OSKey]?.color ??
                              "rgb(231 229 228)",
                          }}
                        />
                        <span>
                          {chartConfig[entry.name as OSKey]?.label ??
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
              nameKey="os"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.os}
                  fill={
                    chartConfig[entry.os as OSKey]?.color ?? "rgb(231 229 228)"
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
        Showing Clicks by OS for the last 6 months
      </p>
    </div>
  );
}
