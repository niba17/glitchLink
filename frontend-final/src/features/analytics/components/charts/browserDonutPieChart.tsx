// frontend-final/src/features/analytics/components/charts/BrowserDonutPieChart.tsx
"use client";

import * as React from "react";
import { Pie, PieChart, Cell, Label, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

export const description = "A donut chart with text";

const chartData = [
  { key: "chrome", clicks: 500 },
  { key: "firefox", clicks: 300 },
  { key: "edge", clicks: 200 },
  { key: "safari", clicks: 150 },
];

type BrowserKey = "chrome" | "firefox" | "edge" | "safari";

const chartConfig: Record<BrowserKey, { label: string; color: string }> = {
  chrome: { label: "Chrome", color: "#4285F4" },
  firefox: { label: "Firefox", color: "#FF7139" },
  edge: { label: "Edge", color: "#0c9dff" },
  safari: { label: "Safari", color: "#1ec8e8" },
};

export function BrowserDonutPieChart() {
  const totalClicks = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.clicks, 0);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold text-stone-200 mb-4">Browser</h2>

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
                              chartConfig[entry.name as BrowserKey]?.color ??
                              "rgb(231 229 228)",
                          }}
                        />
                        <span>
                          {chartConfig[entry.name as BrowserKey]?.label ??
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
              dataKey="clicks"
              nameKey="key"
              innerRadius={60}
              strokeWidth={5}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={
                    chartConfig[entry.key as BrowserKey]?.color ??
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
                          {totalClicks.toLocaleString()}
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
        Showing Click by browser for the last 6 months
      </p>
    </div>
  );
}
