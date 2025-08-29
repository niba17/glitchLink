"use client";

import * as React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import DateRangePicker from "@/components/ui/date-range-picker";
import { eachDayOfInterval, format, startOfMonth, endOfMonth } from "date-fns";
import { type DateRange } from "react-day-picker";

// ---- Type definitions ----
type DeviceKey = "desktop" | "mobile";
type BrowserKey = "Chrome" | "Firefox" | "Edge" | "Safari";
type OSKey = "Windows" | "macOS" | "Linux" | "Android" | "iOS";
type ChartKey = DeviceKey | BrowserKey | OSKey;

interface ChartDataItem {
  date: string;
  desktop: number;
  mobile: number;
  Chrome: number;
  Firefox: number;
  Edge: number;
  Safari: number;
  Windows: number;
  macOS: number;
  Linux: number;
  Android: number;
  iOS: number;
}

// ---- Chart config ----
const chartConfig: Record<ChartKey, { label: string; color: string }> = {
  desktop: { label: "Desktop", color: "#1ee85a" },
  mobile: { label: "Mobile", color: "#e81e54" },
  Chrome: { label: "Chrome", color: "#4285F4" },
  Firefox: { label: "Firefox", color: "#FF7139" },
  Edge: { label: "Edge", color: "#0078D7" },
  Safari: { label: "Safari", color: "#00A1F1" },
  Windows: { label: "Windows", color: "#00BCF2" },
  macOS: { label: "macOS", color: "#999999" },
  Linux: { label: "Linux", color: "#FCC624" },
  Android: { label: "Android", color: "#3DDC84" },
  iOS: { label: "iOS", color: "#A2AAAD" },
};

// ---- Sample data ----
const chartDataSample: ChartDataItem[] = [
  {
    date: "2025-08-01",
    desktop: 222,
    mobile: 150,
    Chrome: 180,
    Firefox: 120,
    Edge: 50,
    Safari: 22,
    Windows: 200,
    macOS: 120,
    Linux: 52,
    Android: 150,
    iOS: 50,
  },
  {
    date: "2025-08-02",
    desktop: 190,
    mobile: 140,
    Chrome: 160,
    Firefox: 100,
    Edge: 40,
    Safari: 30,
    Windows: 180,
    macOS: 110,
    Linux: 40,
    Android: 140,
    iOS: 50,
  },
  {
    date: "2025-08-03",
    desktop: 167,
    mobile: 120,
    Chrome: 130,
    Firefox: 90,
    Edge: 30,
    Safari: 37,
    Windows: 160,
    macOS: 80,
    Linux: 47,
    Android: 120,
    iOS: 60,
  },
  {
    date: "2025-08-04",
    desktop: 242,
    mobile: 0,
    Chrome: 200,
    Firefox: 30,
    Edge: 12,
    Safari: 0,
    Windows: 220,
    macOS: 12,
    Linux: 10,
    Android: 0,
    iOS: 0,
  },
  {
    date: "2025-08-05",
    desktop: 373,
    mobile: 290,
    Chrome: 300,
    Firefox: 200,
    Edge: 50,
    Safari: 113,
    Windows: 350,
    macOS: 180,
    Linux: 33,
    Android: 270,
    iOS: 120,
  },
  {
    date: "2025-08-06",
    desktop: 97,
    mobile: 180,
    Chrome: 90,
    Firefox: 50,
    Edge: 20,
    Safari: 17,
    Windows: 80,
    macOS: 60,
    Linux: 37,
    Android: 140,
    iOS: 40,
  },
  {
    date: "2025-08-07",
    desktop: 210,
    mobile: 130,
    Chrome: 170,
    Firefox: 80,
    Edge: 30,
    Safari: 60,
    Windows: 190,
    macOS: 100,
    Linux: 50,
    Android: 120,
    iOS: 50,
  },
  {
    date: "2025-08-08",
    desktop: 180,
    mobile: 160,
    Chrome: 150,
    Firefox: 70,
    Edge: 20,
    Safari: 100,
    Windows: 160,
    macOS: 120,
    Linux: 40,
    Android: 130,
    iOS: 50,
  },
];

export function DateRangeChartLineInteractive() {
  const devices: DeviceKey[] = ["desktop", "mobile"];
  const browsers: BrowserKey[] = ["Chrome", "Firefox", "Edge", "Safari"];
  const osList: OSKey[] = ["Windows", "macOS", "Linux", "Android", "iOS"];

  const [activeDevices, setActiveDevices] = React.useState<DeviceKey[]>([
    ...devices,
  ]);
  const [activeBrowsers, setActiveBrowsers] = React.useState<BrowserKey[]>([
    ...browsers,
  ]);
  const [activeOS, setActiveOS] = React.useState<OSKey[]>([...osList]);

  const [renderedDevices, setRenderedDevices] = React.useState<DeviceKey[]>([
    ...devices,
  ]);
  const [renderedBrowsers, setRenderedBrowsers] = React.useState<BrowserKey[]>([
    ...browsers,
  ]);
  const [renderedOS, setRenderedOS] = React.useState<OSKey[]>([...osList]);

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const lineColors: Record<ChartKey, string> = {
    desktop: "#1ee85a",
    mobile: "#e81e54",
    Chrome: "#4285F4",
    Firefox: "#FF7139",
    Edge: "#0078D7",
    Safari: "#00A1F1",
    Windows: "#00BCF2",
    macOS: "#999999",
    Linux: "#FCC624",
    Android: "#3DDC84",
    iOS: "#A2AAAD",
  };

  // --- chartData calculation ---
  const chartData = React.useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return chartDataSample;
    const allDates = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to,
    });
    return allDates.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const found = chartDataSample.find((d) => d.date === dateStr);
      return (
        ["desktop", "mobile", ...browsers, ...osList] as ChartKey[]
      ).reduce(
        (acc, key) => {
          acc[key] = found ? found[key] : 0;
          return acc;
        },
        { date: dateStr } as ChartDataItem
      );
    });
  }, [dateRange]);

  const total = React.useMemo(() => {
    return (["desktop", "mobile", ...browsers, ...osList] as ChartKey[]).reduce(
      (acc, key) => {
        acc[key] = chartData.reduce((sum, curr) => sum + curr[key], 0);
        return acc;
      },
      {} as Record<ChartKey, number>
    );
  }, [chartData]);

  // ---- toggle handlers ----
  const toggleLine = <T extends ChartKey>(
    key: T,
    active: T[],
    setActive: React.Dispatch<React.SetStateAction<T[]>>,
    rendered: T[],
    setRendered: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    if (active.includes(key)) {
      setActive((prev) => prev.filter((k) => k !== key));
    } else {
      setActive((prev) => [...prev, key]);
      if (!rendered.includes(key)) setRendered((prev) => [...prev, key]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 items-center">
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
                onCheckedChange={() =>
                  toggleLine(
                    d,
                    activeDevices,
                    setActiveDevices,
                    renderedDevices,
                    setRenderedDevices
                  )
                }
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
                onCheckedChange={() =>
                  toggleLine(
                    o,
                    activeOS,
                    setActiveOS,
                    renderedOS,
                    setRenderedOS
                  )
                }
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
                onCheckedChange={() =>
                  toggleLine(
                    b,
                    activeBrowsers,
                    setActiveBrowsers,
                    renderedBrowsers,
                    setRenderedBrowsers
                  )
                }
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

          {/* Render lines dengan key dinamis supaya animasi muncul */}
          {renderedDevices.map((d) => (
            <Line
              key={`${d}-${activeDevices.includes(d) ? 1 : 0}`}
              type="linear"
              dataKey={d}
              stroke={lineColors[d]}
              strokeWidth={2}
              dot={false}
              hide={!activeDevices.includes(d)}
              isAnimationActive={true}
              animationDuration={1000}
            />
          ))}
          {renderedBrowsers.map((b) => (
            <Line
              key={`${b}-${activeBrowsers.includes(b) ? 1 : 0}`}
              type="linear"
              dataKey={b}
              stroke={lineColors[b]}
              strokeWidth={2}
              dot={false}
              hide={!activeBrowsers.includes(b)}
              isAnimationActive={true}
              animationDuration={1000}
            />
          ))}
          {renderedOS.map((o) => (
            <Line
              key={`${o}-${activeOS.includes(o) ? 1 : 0}`}
              type="linear"
              dataKey={o}
              stroke={lineColors[o]}
              strokeWidth={2}
              dot={false}
              hide={!activeOS.includes(o)}
              isAnimationActive={true}
              animationDuration={1000}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  );
}
