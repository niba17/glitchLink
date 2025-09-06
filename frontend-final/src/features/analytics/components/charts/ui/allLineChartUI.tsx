// frontend-final/src/features/analytics/components/charts/allLineChartUI.tsx

"use client";

import * as React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { chartConfig } from "@/features/analytics/config/chartConfig";
import { ChartDataItem } from "@/features/analytics/samples/dataSamples";
import { ChartKey } from "@/features/analytics/types/type";

interface AllLineChartUIProps {
  chartData: ChartDataItem[];
  active: Record<"devices" | "browsers" | "osList", ChartKey[]>;
  rendered: Record<"devices" | "browsers" | "osList", ChartKey[]>;
}

export function AllLineChartUI({
  chartData,
  active,
  rendered,
}: AllLineChartUIProps) {
  const allRenderedKeys = {
    devices: rendered.devices,
    browsers: rendered.browsers,
    osList: rendered.osList,
  };

  const allActiveKeys = {
    devices: active.devices,
    browsers: active.browsers,
    osList: active.osList,
  };

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          ticks={chartData.map((d) => d.date)}
          tickFormatter={(value) =>
            new Date(value).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          }
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.toLocaleString()}
        />
        <ChartTooltip
          content={({ payload, label }) => (
            <div className="w-[150px] bg-zinc-800 bg-opacity-70 p-2 text-accent">
              <div className="text-sm mb-1">
                {new Date(label).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              {payload?.map((entry) => (
                <div
                  key={entry.dataKey}
                  className="flex justify-between items-center"
                >
                  <span className="flex items-center space-x-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span>{entry.dataKey}</span>
                  </span>
                  <span>{entry.value?.toLocaleString() ?? "0"}</span>
                </div>
              ))}
            </div>
          )}
        />

        {Object.keys(allRenderedKeys).map((type) => {
          return allRenderedKeys[type as keyof typeof allRenderedKeys].map(
            (key) => {
              const isActive =
                allActiveKeys[type as keyof typeof allActiveKeys].includes(key);
              return (
                <Line
                  key={key} // ✨ Perbaikan di sini: kunci hanya berdasarkan dataKey
                  type="linear"
                  dataKey={key}
                  stroke={chartConfig[key].color}
                  strokeWidth={2}
                  dot={false}
                  hide={!isActive}
                  // ✨ Tambahan: Menghilangkan animasi jika tidak aktif
                  isAnimationActive={isActive}
                  animationDuration={300} // Anda bisa sesuaikan durasi animasi
                />
              );
            }
          );
        })}
      </LineChart>
    </ChartContainer>
  );
}
