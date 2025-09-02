// frontend-final/src/features/analytics/components/charts/BrowserDonutPieChart.tsx
"use client";
import * as React from "react";
import { Pie, PieChart, Cell, Label, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

type BrowserKey = "Chrome" | "Firefox" | "Edge" | "Safari";

interface Props {
  chartData: { key: BrowserKey; clicks: number }[];
  activeKeys: BrowserKey[];
}

const chartConfig: Record<BrowserKey, { label: string; color: string }> = {
  Chrome: { label: "Chrome", color: "#4285F4" },
  Firefox: { label: "Firefox", color: "#FF7139" },
  Edge: { label: "Edge", color: "#0c9dff" },
  Safari: { label: "Safari", color: "#1ec8e8" },
};

export function BrowserDonutPieChart({ chartData, activeKeys }: Props) {
  const total = React.useMemo(() => {
    return chartData.reduce((acc, item) => {
      if (activeKeys.includes(item.key)) acc[item.key] = item.clicks;
      return acc;
    }, {} as Record<BrowserKey, number>);
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
              data={activeKeys.map((key) => ({ key, clicks: total[key] || 0 }))}
              dataKey="clicks"
              nameKey="key"
              innerRadius={50}
              strokeWidth={1}
              labelLine={false}
              label={({ index, value, cx, cy, midAngle, outerRadius }) => {
                const entry = activeKeys[index];
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
                    style={{ fill: chartConfig[entry]?.color }}
                    className="text-[10px]"
                  >
                    {`${chartConfig[entry]?.label ?? entry}: ${value}`}
                  </text>
                );
              }}
            >
              {activeKeys.map((key) => (
                <Cell key={key} fill={chartConfig[key]?.color} />
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
                        {Object.values(total).reduce((a, b) => a + b, 0)}
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
