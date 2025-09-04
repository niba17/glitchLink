// frontend-final/src/features/analytics/components/containers/allLineChartContainer.tsx
"use client";

import * as React from "react";
import { AllLineCardUI } from "../cards/allLineCardUI";
import { eachDayOfInterval, format } from "date-fns";
import { type DateRange } from "react-day-picker";
import {
  DeviceKey,
  OSKey,
  BrowserKey,
  chartConfig,
} from "@/features/analytics/config/chartConfig";
import {
  chartDataSample,
  ChartDataItem,
} from "@/features/analytics/samples/dataSamples";
import { AllLineChartUI } from "../charts/allLineChartUI";

type ChartKey = DeviceKey | BrowserKey | OSKey;

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
