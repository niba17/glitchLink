// frontend-final/src/features/analytics/utils/dataAggregators.ts

import { ChartDataItem } from "@/features/analytics/samples/dataSamples";
import {
  devices,
  browsers,
  osList,
} from "@/features/analytics/constants/analyticsKeys";
import {
  DeviceKey,
  BrowserKey,
  OSKey,
  ChartKey,
} from "@/features/analytics/types/type";

type AggregatedData = {
  key: ChartKey;
  clicks: number;
};

export const aggregateData = (filteredData: ChartDataItem[]) => {
  const allKeys = {
    devices: devices as ChartKey[],
    browsers: browsers as ChartKey[],
    osList: osList as ChartKey[],
  };

  const aggregated: Record<keyof typeof allKeys, AggregatedData[]> = {
    devices: devices.map((key) => ({ key, clicks: 0 })),
    browsers: browsers.map((key) => ({ key, clicks: 0 })),
    osList: osList.map((key) => ({ key, clicks: 0 })),
  } as Record<keyof typeof allKeys, AggregatedData[]>;

  filteredData.forEach((day) => {
    Object.keys(day).forEach((key) => {
      if (key !== "date") {
        const value = day[key as ChartKey];
        if (typeof value === "number") {
          Object.keys(allKeys).forEach((type) => {
            const typedKeys = allKeys[type as keyof typeof allKeys];
            if (typedKeys.includes(key as ChartKey)) {
              const item = aggregated[type as keyof typeof allKeys].find(
                (d) => d.key === key
              );
              if (item) {
                item.clicks += value;
              }
            }
          });
        }
      }
    });
  });

  return aggregated;
};
