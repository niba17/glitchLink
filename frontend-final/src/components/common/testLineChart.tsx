"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import DateRangePicker from "@/components/ui/date-range-picker";
import { type DateRange } from "react-day-picker";
import { addDays, eachDayOfInterval, format } from "date-fns";

export const description = "An interactive multi-line chart";

const chartConfig = {
  desktop: { label: "Desktop", color: "#1ee85a" },
  mobile: { label: "Mobile", color: "#e81e54" },
} satisfies ChartConfig;

// Data sample statis
const chartDataSample = [
  { date: "2025-08-01", desktop: 222, mobile: 150 },
  { date: "2025-08-03", desktop: 167, mobile: 120 },
  { date: "2025-08-04", desktop: 242, mobile: 0 },
  { date: "2025-08-05", desktop: 373, mobile: 290 },
  { date: "2025-08-06", desktop: 97, mobile: 180 },
  { date: "2025-08-07", desktop: 210, mobile: 130 },
  { date: "2025-08-08", desktop: 180, mobile: 160 },
];

// ... imports sama seperti sebelumnya

export function ChartLineInteractive() {
  const [activeCharts, setActiveCharts] = React.useState<
    (keyof typeof chartConfig)[]
  >(["desktop", "mobile"]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(chartDataSample[0].date),
    to: new Date(chartDataSample[chartDataSample.length - 1].date),
  });

  const toggleChart = (key: keyof typeof chartConfig, checked: boolean) => {
    setActiveCharts((prev) =>
      checked ? [...prev, key] : prev.filter((k) => k !== key)
    );
  };

  const chartData = React.useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return chartDataSample;

    const allDates = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to,
    });

    return allDates.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const found = chartDataSample.find((d) => d.date === dateStr); // bandingkan string
      return {
        date: dateStr,
        desktop: found?.desktop ?? 0,
        mobile: found?.mobile ?? 0,
      };
    });
  }, [dateRange]);

  const total = React.useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    [chartData]
  );

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 items-center">
        {/* <div>
          <h2 className="text-lg font-semibold">Line Chart - Interactive</h2>
          <p className="text-sm text-muted-foreground">
            Showing total visitors for the selected range
          </p>
        </div> */}
        {/* onChange langsung update state, memicu useMemo chartData */}
        <DateRangePicker onChange={setDateRange as any} />
        {/* Device Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Device</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {(["desktop", "mobile"] as const).map((key) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={activeCharts.includes(key)}
                onCheckedChange={(checked) =>
                  toggleChart(key, checked === true)
                }
                onSelect={(e) => e.preventDefault()}
                className="justify-between"
              >
                <span>{chartConfig[key].label}</span>
                <span>{total[key].toLocaleString()}</span>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={20}
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
            content={
              <ChartTooltipContent
                className="w-[150px]"
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                }
              />
            }
          />
          {(["desktop", "mobile"] as const).map((key) => (
            <Line
              key={key}
              type="linear"
              dataKey={key}
              stroke={chartConfig[key].color}
              strokeWidth={2}
              dot={false}
              hide={!activeCharts.includes(key)}
              isAnimationActive
              animationDuration={500}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  );
}
