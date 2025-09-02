"use client";

import * as React from "react";
import { DeviceDonutPieChart } from "../charts/deviceDonutPieChart";
import {
  DeviceKey,
  chartConfig,
} from "@/features/analytics/config/chartConfig";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface DeviceDonutPieChartContainerProps {
  chartData: { key: DeviceKey; clicks: number }[];
}

export function DeviceDonutPieChartContainer({
  chartData,
}: DeviceDonutPieChartContainerProps) {
  const [activeKeys, setActiveKeys] = React.useState<DeviceKey[]>([
    "Desktop",
    "Mobile",
    "Tablet",
  ]);

  const onToggleKey = React.useCallback((key: DeviceKey) => {
    setActiveKeys((prevActiveKeys) =>
      prevActiveKeys.includes(key)
        ? prevActiveKeys.filter((k) => k !== key)
        : [...prevActiveKeys, key]
    );
  }, []);

  const total = React.useMemo(() => {
    return chartData
      .filter((item) => activeKeys.includes(item.key))
      .reduce((acc, item) => acc + item.clicks, 0);
  }, [chartData, activeKeys]);

  const filteredData = React.useMemo(() => {
    return chartData.filter((item) => activeKeys.includes(item.key));
  }, [chartData, activeKeys]);

  return (
    <div className="flex flex-col items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Device</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {chartData.map((d) => (
            <DropdownMenuCheckboxItem
              key={d.key}
              checked={activeKeys.includes(d.key)}
              onCheckedChange={() => onToggleKey(d.key)}
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

      <DeviceDonutPieChart
        chartData={filteredData}
        activeKeys={activeKeys}
        onToggleKey={onToggleKey}
        totalClicks={total}
      />
    </div>
  );
}
