"use client";

import * as React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  chartConfig,
  DeviceKey,
  OSKey,
  BrowserKey,
} from "@/features/analytics/config/chartConfig";
import { ChartDataItem } from "@/features/analytics/samples/dataSamples";

type ChartKey = DeviceKey | BrowserKey | OSKey;

interface AllLineChartUIProps {
  chartData: ChartDataItem[];
  activeDevices: DeviceKey[];
  activeBrowsers: BrowserKey[];
  activeOS: OSKey[];
  renderedDevices: DeviceKey[];
  renderedBrowsers: BrowserKey[];
  renderedOS: OSKey[];
}

export function AllLineChartUI({
  chartData,
  activeDevices,
  activeBrowsers,
  activeOS,
  renderedDevices,
  renderedBrowsers,
  renderedOS,
}: AllLineChartUIProps) {
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
            <div className="w-[150px] bg-zinc-900/80 p-2 text-stone-200">
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

        {/* Render lines */}
        {renderedDevices.map((d) => (
          <Line
            key={`${d}-${activeDevices.includes(d) ? 1 : 0}`}
            type="linear"
            dataKey={d}
            stroke={chartConfig[d].color}
            strokeWidth={2}
            dot={false}
            hide={!activeDevices.includes(d)}
          />
        ))}
        {renderedBrowsers.map((b) => (
          <Line
            key={`${b}-${activeBrowsers.includes(b) ? 1 : 0}`}
            type="linear"
            dataKey={b}
            stroke={chartConfig[b].color}
            strokeWidth={2}
            dot={false}
            hide={!activeBrowsers.includes(b)}
          />
        ))}
        {renderedOS.map((o) => (
          <Line
            key={`${o}-${activeOS.includes(o) ? 1 : 0}`}
            type="linear"
            dataKey={o}
            stroke={chartConfig[o].color}
            strokeWidth={2}
            dot={false}
            hide={!activeOS.includes(o)}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
