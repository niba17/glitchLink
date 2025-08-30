"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";

export const description = "A bar chart with a label";

const chartData = [
  { month: "Desktop", desktop: 186 },
  { month: "Tablet", desktop: 305 },
  { month: "Mobile", desktop: 237 },
];
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function LinkTotalClickCardWithBackground() {
  return (
    <Card className="bg-zinc-950 shadow-none">
      <CardHeader className="pb-0">
        <div className="flex justify-between">
          <CardTitle className="text-stone-200">Total 32 Clicks</CardTitle>
        </div>
        <CardDescription>
          Showing total clicks for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-5 flex">
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
              //   tickFormatter={(value) => value.slice(0, 3)}
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

        {/* <CardFooter className="flex-col items-start gap-2 text-sm py-0">
          <div className="flex gap-2 leading-none font-medium">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            Showing total visitors for the last 6 months
          </div>
        </CardFooter> */}
      </CardContent>
      {/* <CardFooter className="flex justify-end">
        <Button variant="outline">Analyze</Button>
        <Button className="">Analyze</Button>
      </CardFooter> */}
    </Card>
  );
}
