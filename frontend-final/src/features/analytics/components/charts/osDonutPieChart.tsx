// frontend-final/src/features/analytics/components/charts/OSDonutPieChart.tsx
"use client";

import * as React from "react";
import { Pie, PieChart, Cell, Label, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

export const description = "A donut chart showing OS distribution";

const chartData = [
  { key: "Windows", clicks: 320 },
  { key: "macOS", clicks: 210 },
  { key: "Linux", clicks: 150 },
  { key: "Android", clicks: 280 },
  { key: "iOS", clicks: 190 },
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
    return chartData.reduce((acc, curr) => acc + curr.clicks, 0);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold text-stone-200">Operating System</h2>

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
              dataKey="clicks"
              nameKey="key"
              innerRadius={50}
              strokeWidth={1}
              labelLine={false} // garis dihilangkan
              label={({ index, value, cx, cy, midAngle, outerRadius }) => {
                const entry = chartData[index];
                const name = entry.key as OSKey;

                const RADIAN = Math.PI / 180;
                const radius = outerRadius! + 10; // jarak sedikit di luar
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text
                    x={x}
                    y={y}
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                    style={{ fill: chartConfig[name]?.color }} // ikut warna slice
                    className="text-[10px]"
                  >
                    {`${chartConfig[name]?.label ?? name}: ${value}`}
                  </text>
                );
              }}
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={
                    chartConfig[entry.key as OSKey]?.color ?? "rgb(231 229 228)"
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
                          className="fill-muted-foreground"
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

      <p className="text-sm text-muted-foreground">
        Clicks by OS for the last 6 months
      </p>
    </div>
  );
}
