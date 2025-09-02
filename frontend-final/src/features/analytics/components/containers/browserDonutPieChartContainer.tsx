// frontend-final/src/features/analytics/components/containers/browserDonutPieChartContainer.tsx
"use client";

import * as React from "react";
import { BrowserDonutPieChart } from "../charts/browserDonutPieChart";
import {
  BrowserKey,
  chartConfig,
} from "@/features/analytics/config/chartConfig";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface BrowserDonutPieChartContainerProps {
  chartData: { key: BrowserKey; clicks: number }[];
}

export function BrowserDonutPieChartContainer({
  chartData,
}: BrowserDonutPieChartContainerProps) {
  const [activeKeys, setActiveKeys] = React.useState<BrowserKey[]>([
    "Chrome",
    "Firefox",
    "Edge",
    "Safari",
    "Opera",
  ]);

  const onToggleKey = React.useCallback(
    (key: BrowserKey) => {
      setActiveKeys((prevActiveKeys) =>
        prevActiveKeys.includes(key)
          ? prevActiveKeys.filter((k) => k !== key)
          : [...prevActiveKeys, key]
      );
    },
    [setActiveKeys]
  );

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
      {/* Tambahkan DropdownMenu untuk Browser di sini */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Browser</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {chartData.map((b) => (
            <DropdownMenuCheckboxItem
              key={b.key}
              checked={activeKeys.includes(b.key)}
              onCheckedChange={() => onToggleKey(b.key)}
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

      {/* Panggil komponen presentasi */}
      <BrowserDonutPieChart
        chartData={filteredData}
        activeKeys={activeKeys}
        onToggleKey={onToggleKey}
        totalClicks={total}
      />
    </div>
  );
}
