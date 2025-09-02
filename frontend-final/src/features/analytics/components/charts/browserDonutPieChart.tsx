// frontend-final/src/features/analytics/components/charts/BrowserDonutPieChart.tsx
"use client";

import * as React from "react";
import { Pie, PieChart, Cell, Label, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

type BrowserKey = "Chrome" | "Firefox" | "Edge" | "Safari" | "Opera";

interface Props {
  chartData: { key: BrowserKey; clicks: number }[];
  activeKeys: BrowserKey[];
  onToggleKey: (key: BrowserKey) => void;
}

const chartConfig: Record<BrowserKey, { label: string; color: string }> = {
  Chrome: { label: "Chrome", color: "#4285F4" },
  Firefox: { label: "Firefox", color: "#FF7139" },
  Edge: { label: "Edge", color: "#0c9dff" },
  Safari: { label: "Safari", color: "#1ec8e8" },
  Opera: { label: "Opera", color: "#cc0f16" },
};

export function BrowserDonutPieChart({
  chartData,
  activeKeys,
  onToggleKey,
}: Props) {
  const total = React.useMemo(() => {
    return chartData
      .filter((item) => activeKeys.includes(item.key))
      .reduce((acc, item) => acc + item.clicks, 0);
  }, [chartData, activeKeys]);

  const filteredData = React.useMemo(() => {
    return chartData.filter((item) => activeKeys.includes(item.key));
  }, [chartData, activeKeys]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold text-stone-200">Browser</h2>
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
                              chartConfig[entry.name as BrowserKey]?.color,
                          }}
                        />
                        <span>
                          {chartConfig[entry.name as BrowserKey]?.label ??
                            entry.name}
                        </span>
                      </span>
                      <span>{entry.value?.toLocaleString() ?? 0}</span>
                    </div>
                  ))}
                </div>
              )}
            />
            <Pie
              data={filteredData}
              dataKey="clicks"
              nameKey="key"
              innerRadius={50}
              strokeWidth={1}
              labelLine={false}
              label={({ index, value, cx, cy, midAngle, outerRadius }) => {
                const entry = filteredData[index];
                const RADIAN = Math.PI / 180;
                const radius = outerRadius! + 10;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                return (
                  <text
                    x={x}
                    y={y}
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                    style={{ fill: chartConfig[entry.key]?.color }}
                    className="text-[10px]"
                  >
                    {`${chartConfig[entry.key]?.label ?? entry.key}: ${value}`}
                  </text>
                );
              }}
            >
              {filteredData.map((item) => (
                <Cell
                  key={item.key}
                  fill={chartConfig[item.key]?.color}
                  onClick={() => onToggleKey(item.key)}
                  className="cursor-pointer"
                />
              ))}
              <Label
                content={({ viewBox }) =>
                  viewBox && "cx" in viewBox && "cy" in viewBox ? (
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
                        {total}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Clicks
                      </tspan>
                    </text>
                  ) : null
                }
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
      <p className="text-sm text-muted-foreground">
        Last click about 5 mins ago
      </p>
    </div>
  );
}
