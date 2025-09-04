// frontend-final/src/features/analytics/components/containers/allLineChartContainer.tsx
"use client";

import * as React from "react";
import { DeviceKey, BrowserKey, OSKey } from "@/features/analytics/types/type";

import { ChartDataItem } from "@/features/analytics/samples/dataSamples";
import { AllLineChartUI } from "../charts/allLineChartUI";

interface AllLineChartContainerProps {
  chartData: ChartDataItem[];
  activeDevices: DeviceKey[];
  activeBrowsers: BrowserKey[];
  activeOS: OSKey[];
  renderedDevices: DeviceKey[];
  renderedBrowsers: BrowserKey[];
  renderedOS: OSKey[];
}

export function AllLineChartContainer(props: AllLineChartContainerProps) {
  return <AllLineChartUI {...props} />;
}
