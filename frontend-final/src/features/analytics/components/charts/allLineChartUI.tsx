"use client";

import * as React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import DateRangePicker from "@/components/ui/date-range-picker";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  chartConfig,
  DeviceKey,
  OSKey,
  BrowserKey,
} from "@/features/analytics/config/chartConfig";
import { ChartDataItem } from "@/features/analytics/samples/dataSamples";
import { type DateRange } from "react-day-picker";

type ChartKey = DeviceKey | BrowserKey | OSKey;

interface AllLineChartUIProps {
  devices: DeviceKey[];
  browsers: BrowserKey[];
  osList: OSKey[];
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  chartData: ChartDataItem[];
  total: Record<ChartKey, number>;

  activeDevices: DeviceKey[];
  activeBrowsers: BrowserKey[];
  activeOS: OSKey[];

  renderedDevices: DeviceKey[];
  renderedBrowsers: BrowserKey[];
  renderedOS: OSKey[];

  onToggleDevice: (d: DeviceKey) => void;
  onToggleBrowser: (b: BrowserKey) => void;
  onToggleOS: (o: OSKey) => void;
}

export function AllLineChartUI({
  devices,
  browsers,
  osList,
  dateRange,
  setDateRange,
  chartData,
  total,
  activeDevices,
  activeBrowsers,
  activeOS,
  renderedDevices,
  renderedBrowsers,
  renderedOS,
  onToggleDevice,
  onToggleBrowser,
  onToggleOS,
}: AllLineChartUIProps) {
  return (
    <Card className="bg-transparent p-5 space-y-7">
      <CardHeader className="p-0">
        <div className="flex space-x-2">
          <DateRangePicker
            initialRange={dateRange}
            onChange={setDateRange as any}
          />

          {/* Device Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Device</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {devices.map((d) => (
                <DropdownMenuCheckboxItem
                  key={d}
                  checked={activeDevices.includes(d)}
                  onCheckedChange={() => onToggleDevice(d)}
                  onSelect={(e) => e.preventDefault()}
                  className="justify-between"
                >
                  <span className="flex items-center space-x-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: chartConfig[d].color }}
                    />
                    <span>{chartConfig[d].label}</span>
                  </span>
                  <span>{total[d].toLocaleString()}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* OS Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">OS</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {osList.map((o) => (
                <DropdownMenuCheckboxItem
                  key={o}
                  checked={activeOS.includes(o)}
                  onCheckedChange={() => onToggleOS(o)}
                  onSelect={(e) => e.preventDefault()}
                  className="justify-between"
                >
                  <span className="flex items-center space-x-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: chartConfig[o].color }}
                    />
                    <span>{chartConfig[o].label}</span>
                  </span>
                  <span>{total[o].toLocaleString()}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Browser Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Browser</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {browsers.map((b) => (
                <DropdownMenuCheckboxItem
                  key={b}
                  checked={activeBrowsers.includes(b)}
                  onCheckedChange={() => onToggleBrowser(b)}
                  onSelect={(e) => e.preventDefault()}
                  className="justify-between"
                >
                  <span className="flex items-center space-x-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: chartConfig[b].color }}
                    />
                    <span>{chartConfig[b].label}</span>
                  </span>
                  <span>{total[b].toLocaleString()}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="p-0">
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
      </CardContent>
    </Card>
  );
}
