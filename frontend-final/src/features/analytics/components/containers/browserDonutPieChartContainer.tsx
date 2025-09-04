"use client";

import * as React from "react";
import { BrowserDonutPieChartUI } from "../charts/browserDonutPieChartUI";
import { BrowserKey } from "@/features/analytics/types/type";
interface BrowserDonutPieChartContainerProps {
  chartData: { key: BrowserKey; clicks: number }[];
  activeKeys: BrowserKey[];
  onToggleKey: (key: BrowserKey) => void;
}

function areEqual(
  prev: BrowserDonutPieChartContainerProps,
  next: BrowserDonutPieChartContainerProps
) {
  if (prev.chartData.length !== next.chartData.length) return false;
  for (let i = 0; i < prev.chartData.length; i++) {
    if (
      prev.chartData[i].key !== next.chartData[i].key ||
      prev.chartData[i].clicks !== next.chartData[i].clicks
    )
      return false;
  }
  if (prev.activeKeys.length !== next.activeKeys.length) return false;
  for (let i = 0; i < prev.activeKeys.length; i++) {
    if (prev.activeKeys[i] !== next.activeKeys[i]) return false;
  }
  if (prev.onToggleKey !== next.onToggleKey) return false;
  return true;
}

export const BrowserDonutPieChartContainer = React.memo(
  function BrowserDonutPieChartContainer({
    chartData,
    activeKeys,
    onToggleKey,
  }: BrowserDonutPieChartContainerProps) {
    const totalClicks = React.useMemo(
      () => chartData.reduce((acc, item) => acc + item.clicks, 0),
      [chartData]
    );
    return (
      <BrowserDonutPieChartUI
        chartData={chartData}
        activeKeys={activeKeys}
        onToggleKey={onToggleKey}
        totalClicks={totalClicks}
      />
    );
  },
  areEqual
);
