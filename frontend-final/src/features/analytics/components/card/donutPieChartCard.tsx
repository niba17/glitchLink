"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeviceDonutPieChart } from "../charts/deviceDonutPieChart";
import { OSDonutPieChart } from "../charts/osDonutPieChart";
import { BrowserDonutPieChart } from "../charts/browserDonutPieChart";
import DateRangePicker from "@/components/ui/date-range-picker";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";

type DeviceKey = "desktop" | "mobile" | "tablet";
type OSKey = "Windows" | "macOS" | "Linux" | "Android" | "iOS";
type BrowserKey = "Chrome" | "Firefox" | "Edge" | "Safari";

// Tambahkan chartConfig import atau definisi sama seperti di dateRangeLineChart.tsx
const chartConfig: Record<
  DeviceKey | OSKey | BrowserKey,
  { label: string; color: string }
> = {
  desktop: { label: "Desktop", color: "#1ee85a" },
  mobile: { label: "Mobile", color: "#e81e54" },
  tablet: { label: "Tablet", color: "#9D4EDD" },
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

const initialDeviceData: { key: DeviceKey; clicks: number }[] = [
  { key: "desktop", clicks: 400 },
  { key: "mobile", clicks: 250 },
  { key: "tablet", clicks: 150 },
];
const initialOSData: { key: OSKey; clicks: number }[] = [
  { key: "Windows", clicks: 320 },
  { key: "macOS", clicks: 210 },
  { key: "Linux", clicks: 150 },
  { key: "Android", clicks: 280 },
  { key: "iOS", clicks: 190 },
];
const initialBrowserData: { key: BrowserKey; clicks: number }[] = [
  { key: "Chrome", clicks: 500 },
  { key: "Firefox", clicks: 300 },
  { key: "Edge", clicks: 200 },
  { key: "Safari", clicks: 150 },
];

export default function DonutPieChartCard() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const [activeDevices, setActiveDevices] = React.useState<DeviceKey[]>([
    "desktop",
    "mobile",
    "tablet",
  ]);
  const [activeOS, setActiveOS] = React.useState<OSKey[]>([
    "Windows",
    "macOS",
    "Linux",
    "Android",
    "iOS",
  ]);
  const [activeBrowsers, setActiveBrowsers] = React.useState<BrowserKey[]>([
    "Chrome",
    "Firefox",
    "Edge",
    "Safari",
  ]);

  const toggleLine = <T extends string>(
    key: T,
    active: T[],
    setActive: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    if (active.includes(key)) {
      setActive(active.filter((k) => k !== key));
    } else {
      setActive([...active, key]);
    }
  };

  const deviceData = initialDeviceData;
  const osData = initialOSData;
  const browserData = initialBrowserData;

  return (
    <Card className="bg-transparent">
      <CardHeader className="pb-0">
        <div className="flex space-x-2">
          <DateRangePicker initialRange={dateRange} onChange={setDateRange} />
          {/* Device */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Device</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {deviceData.map((d) => (
                <DropdownMenuCheckboxItem
                  key={d.key}
                  checked={activeDevices.includes(d.key)}
                  onCheckedChange={() =>
                    toggleLine(d.key, activeDevices, setActiveDevices)
                  }
                  onSelect={(e) => e.preventDefault()}
                  className="justify-between"
                >
                  <span className="flex items-center space-x-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: chartConfig[d.key].color }}
                    />

                    <span>{d.key}</span>
                  </span>
                  <span>{d.clicks}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* OS */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">OS</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {osData.map((o) => (
                <DropdownMenuCheckboxItem
                  key={o.key}
                  checked={activeOS.includes(o.key)}
                  onCheckedChange={() =>
                    toggleLine(o.key, activeOS, setActiveOS)
                  }
                  onSelect={(e) => e.preventDefault()}
                  className="justify-between"
                >
                  <span className="flex items-center space-x-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: chartConfig[o.key].color }}
                    />

                    <span>{o.key}</span>
                  </span>
                  <span>{o.clicks}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Browser */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Browser</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {browserData.map((b) => (
                <DropdownMenuCheckboxItem
                  key={b.key}
                  checked={activeBrowsers.includes(b.key)}
                  onCheckedChange={() =>
                    toggleLine(b.key, activeBrowsers, setActiveBrowsers)
                  }
                  onSelect={(e) => e.preventDefault()}
                  className="justify-between"
                >
                  <span className="flex items-center space-x-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: chartConfig[b.key].color }}
                    />

                    <span>{b.key}</span>
                  </span>
                  <span>{b.clicks}</span>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* <div>
            <CardTitle className="text-stone-200">
              Last clicks about 5 min ago
            </CardTitle>
            <CardDescription>
              All clicks of shortlink lifetime
              {dateRange?.from && dateRange?.to
                ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                : "Select date range"}
            </CardDescription>
          </div> */}
      </CardHeader>

      <CardContent className="mt-5 flex space-x-2">
        <DeviceDonutPieChart
          chartData={deviceData}
          activeKeys={activeDevices}
        />
        <OSDonutPieChart chartData={osData} activeKeys={activeOS} />
        <BrowserDonutPieChart
          chartData={browserData}
          activeKeys={activeBrowsers}
        />
      </CardContent>
    </Card>
  );
}
