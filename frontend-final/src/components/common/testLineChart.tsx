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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const description = "An interactive multi-line chart";

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 0 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 97, mobile: 180 },
  // ... data lain sama
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#1ee85a",
  },
  mobile: {
    label: "Mobile",
    color: "#e81e54",
  },
} satisfies ChartConfig;

export function ChartLineInteractive() {
  const [activeCharts, setActiveCharts] = React.useState<
    (keyof typeof chartConfig)[]
  >(["desktop", "mobile"]);

  const toggleChart = (key: keyof typeof chartConfig, checked: boolean) => {
    setActiveCharts((prev) =>
      checked ? [...prev, key] : prev.filter((k) => k !== key)
    );
  };

  const total = React.useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    []
  );

  return (
    <div className="space-y-6">
      {/* Header kecil */}
      <div>
        <h2 className="text-lg font-semibold">Line Chart - Interactive</h2>
        <p className="text-sm text-muted-foreground">
          Showing total visitors for the last 3 months
        </p>
      </div>

      {/* ✅ Ganti ToggleGroup dengan Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Device</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {/* <DropdownMenuLabel>Visible Lines</DropdownMenuLabel> */}
          {/* <DropdownMenuSeparator /> */}
          {(["desktop", "mobile"] as const).map((key) => (
            <DropdownMenuCheckboxItem
              key={key}
              checked={activeCharts.includes(key)}
              onCheckedChange={(checked) => toggleChart(key, checked === true)}
              onSelect={(e) => e.preventDefault()}
              className="justify-between"
            >
              <span>{chartConfig[key].label}</span>
              <span>{total[key].toLocaleString()}</span>
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Chart */}
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{ left: 12, right: 12 }}
        >
          <CartesianGrid vertical={false} />

          {/* Sumbu X */}
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />

          {/* Sumbu Y */}
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
              isAnimationActive={true}
              animationDuration={500}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  );
}
