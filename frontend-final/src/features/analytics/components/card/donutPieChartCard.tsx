"use client";
import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DeviceDonutPieChart } from "../charts/deviceDonutPieChart";
import { OSDonutPieChart } from "../charts/osDonutPieChart";
import { BrowserDonutPieChart } from "../charts/browserDonutPieChart";

export const description = "A bar chart with a label";

const chartData = [
  { month: "Chrome", desktop: 186 },
  { month: "Firefox", desktop: 305 },
  { month: "Edge", desktop: 237 },
  { month: "Safari", desktop: 237 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function DonutPieChartCard() {
  return (
    <Card className="bg-zinc-950 shadow-none">
      <CardHeader className="pb-0">
        <CardTitle className="text-stone-200">
          Last clicks about 5 min ago
        </CardTitle>
        <CardDescription>
          All clicks of shortlink lifetime 03 Jan 2024 - 17 Jun 2024
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-5 flex space-x-2">
        {/* Kiri Donut Chart */}
        <DeviceDonutPieChart />
        <OSDonutPieChart />
        <BrowserDonutPieChart />

        {/* Kanan Bar Chart rapat bawah */}
        {/* <div className="flex flex-1 items-end">
          <ChartContainer className="h-[200px] w-full" config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="desktop" fill="#E7E5E4" radius={8}>
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-stone-200"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div> */}
      </CardContent>
    </Card>
  );
}
