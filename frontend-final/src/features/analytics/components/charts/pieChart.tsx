"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

export const description = "A donut chart with text";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];

type DeviceKey = "desktop" | "mobile";
type BrowserKey = "Chrome" | "Firefox" | "Edge" | "Safari";
type OSKey = "Windows" | "macOS" | "Linux" | "Android" | "iOS";
type ChartKey = DeviceKey | BrowserKey | OSKey;

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

export function ChartPieDonutText() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  const devices: DeviceKey[] = ["desktop", "mobile"];
  const browsers: BrowserKey[] = ["Chrome", "Firefox", "Edge", "Safari"];
  const osList: OSKey[] = ["Windows", "macOS", "Linux", "Android", "iOS"];

  const total = React.useMemo(() => {
    return (["desktop", "mobile", ...browsers, ...osList] as ChartKey[]).reduce(
      (acc, key) => {
        acc[key] = chartData.reduce((sum, curr) => sum + curr[key], 0);
        return acc;
      },
      {} as Record<ChartKey, number>
    );
  }, [chartData]);

  const [renderedDevices, setRenderedDevices] = React.useState<DeviceKey[]>([
    ...devices,
  ]);
  const [renderedBrowsers, setRenderedBrowsers] = React.useState<BrowserKey[]>([
    ...browsers,
  ]);

  const [activeDevices, setActiveDevices] = React.useState<DeviceKey[]>([
    ...devices,
  ]);
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
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Last clicks about 5 min ago</CardTitle>
        <CardDescription>03 Jan 2024 - 17 Jun 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
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
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Clicks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total clicks for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
