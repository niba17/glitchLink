// frontend-final/src/features/analytics/components/cards/donutPieChartUI.tsx
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
type BrowserKey = "Chrome" | "Firefox" | "Edge" | "Safari" | "Opera";

interface DonutPieChartUIProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  deviceData: { key: DeviceKey; clicks: number }[];
  osData: { key: OSKey; clicks: number }[];
  browserData: { key: BrowserKey; clicks: number }[];
  activeDevices: DeviceKey[];
  activeOS: OSKey[];
  activeBrowsers: BrowserKey[];
  onToggleDevice: (key: DeviceKey) => void;
  onToggleOS: (key: OSKey) => void;
  onToggleBrowser: (key: BrowserKey) => void;
}

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
  Opera: { label: "Opera", color: "#cc0f16" },
  Windows: { label: "Windows", color: "#00BCF2" },
  macOS: { label: "macOS", color: "#999999" },
  Linux: { label: "Linux", color: "#FCC624" },
  Android: { label: "Android", color: "#3DDC84" },
  iOS: { label: "iOS", color: "#A2AAAD" },
};

export function DonutPieChartUI({
  dateRange,
  onDateRangeChange,
  deviceData,
  osData,
  browserData,
  activeDevices,
  activeOS,
  activeBrowsers,
  onToggleDevice,
  onToggleOS,
  onToggleBrowser,
}: DonutPieChartUIProps) {
  return (
    <Card className="bg-transparent">
      <CardHeader className="pb-0">
        <div className="flex space-x-2">
          <DateRangePicker
            initialRange={dateRange}
            onChange={onDateRangeChange}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Device</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {deviceData.map((d) => (
                <DropdownMenuCheckboxItem
                  key={d.key}
                  checked={activeDevices.includes(d.key)}
                  onCheckedChange={() => onToggleDevice(d.key)}
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">OS</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {osData.map((o) => (
                <DropdownMenuCheckboxItem
                  key={o.key}
                  checked={activeOS.includes(o.key)}
                  onCheckedChange={() => onToggleOS(o.key)}
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Browser</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {browserData.map((b) => (
                <DropdownMenuCheckboxItem
                  key={b.key}
                  checked={activeBrowsers.includes(b.key)}
                  onCheckedChange={() => onToggleBrowser(b.key)}
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
      </CardHeader>
      <CardContent className="mt-5 flex space-x-2">
        <DeviceDonutPieChart
          key="device-chart"
          chartData={deviceData}
          activeKeys={activeDevices}
          onToggleKey={onToggleDevice}
        />
        <OSDonutPieChart
          key="os-chart"
          chartData={osData}
          activeKeys={activeOS}
          onToggleKey={onToggleOS}
        />
        <BrowserDonutPieChart
          key="browser-chart"
          chartData={browserData}
          activeKeys={activeBrowsers}
          onToggleKey={onToggleBrowser}
        />
      </CardContent>
    </Card>
  );
}
