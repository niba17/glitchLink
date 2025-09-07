// Lokasi File: frontend-final/src/features/analytics/components/cards/ui/lineCardUI.tsx

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DateRangePicker from "@/components/ui/date-range-picker";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { type DateRange } from "react-day-picker";
import {
  ChartKey,
  ChartDataItem,
  DeviceKey,
  BrowserKey,
  OSKey,
} from "@/features/analytics/types/type";
import { AllLineChartContainer } from "@/features/analytics/components/charts/containers/allLineChartContainer";
import {
  devices,
  browsers,
  osList,
} from "@/features/analytics/constants/analyticsKeys";
import { chartConfig } from "@/features/analytics/config/chartConfig";

interface LineCardUIProps {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  chartData: ChartDataItem[];
  activeDevices: DeviceKey[];
  activeOS: OSKey[];
  activeBrowsers: BrowserKey[];
  onToggleDevice: (key: DeviceKey) => void;
  onToggleOS: (key: OSKey) => void;
  onToggleBrowser: (key: BrowserKey) => void;
}

export function LineCardUI({
  dateRange,
  setDateRange,
  chartData,
  activeDevices,
  activeOS,
  activeBrowsers,
  onToggleDevice,
  onToggleOS,
  onToggleBrowser,
}: LineCardUIProps) {
  // Fungsi pembantu untuk menghitung total klik per key
  const calculateTotals = (keys: ChartKey[]) => {
    const totals: Record<ChartKey, number> = {} as Record<ChartKey, number>;
    keys.forEach((key) => {
      totals[key] = chartData.reduce(
        (sum, item) => sum + ((item[key] as number) || 0),
        0
      );
    });
    return totals;
  };

  const deviceTotals = calculateTotals(devices as ChartKey[]);
  const osTotals = calculateTotals(osList as ChartKey[]);
  const browserTotals = calculateTotals(browsers as ChartKey[]);

  const renderDropdown = (
    label: string,
    keys: string[],
    activeKeys: string[],
    totals: Record<string, number>,
    onToggle: (key: any) => void
  ) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {keys.map((key) => (
          <DropdownMenuCheckboxItem
            key={key}
            checked={activeKeys.includes(key)}
            onCheckedChange={() => onToggle(key)}
            onSelect={(e: Event) => e.preventDefault()}
            className="justify-between"
          >
            <span className="flex items-center space-x-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    chartConfig[key as keyof typeof chartConfig]?.color ||
                    "#8884d8",
                }}
              />
              <span>{key}</span>
            </span>
            <span>{totals[key]?.toLocaleString()}</span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Card className="bg-foreground p-5 space-y-7">
      <CardHeader className="p-0">
        <div className="flex space-x-2">
          <DateRangePicker
            key={JSON.stringify(dateRange)}
            initialRange={dateRange}
            onChange={setDateRange}
          />
          {renderDropdown(
            "Device",
            devices,
            activeDevices,
            deviceTotals,
            onToggleDevice
          )}
          {renderDropdown("OS", osList, activeOS, osTotals, onToggleOS)}
          {renderDropdown(
            "Browser",
            browsers,
            activeBrowsers,
            browserTotals,
            onToggleBrowser
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <AllLineChartContainer
          chartData={chartData}
          active={{
            devices: activeDevices,
            osList: activeOS,
            browsers: activeBrowsers,
          }}
        />
      </CardContent>
    </Card>
  );
}
