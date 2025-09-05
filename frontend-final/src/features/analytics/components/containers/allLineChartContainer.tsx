// frontend-final/src/features/analytics/components/containers/allLineChartContainer.tsx
"use client";

import * as React from "react";
import { ChartKey } from "@/features/analytics/types/type";
import { ChartDataItem } from "@/features/analytics/samples/dataSamples";
import { AllLineChartUI } from "../charts/allLineChartUI";

// Hapus atau ganti antarmuka lama
interface AllLineChartContainerProps {
  chartData: ChartDataItem[];
  active: Record<"devices" | "browsers" | "osList", ChartKey[]>;
  rendered: Record<"devices" | "browsers" | "osList", ChartKey[]>;
}

export function AllLineChartContainer(props: AllLineChartContainerProps) {
  return <AllLineChartUI {...props} />;
}
