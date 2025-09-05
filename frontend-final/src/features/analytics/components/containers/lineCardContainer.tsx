// frontend-final/src/features/analytics/components/containers/lineCardContainer.tsx

"use client";

import * as React from "react";
import { LineCardUI } from "@/features/analytics/components/cards/lineCardUI";
import { AllLineChartContainer } from "@/features/analytics/components/containers/allLineChartContainer";
import { ChartKey } from "@/features/analytics/types/type";
import { eachDayOfInterval, format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  chartDataSample,
  ChartDataItem,
} from "@/features/analytics/samples/dataSamples";
import {
  devices,
  browsers,
  osList,
} from "@/features/analytics/constants/analyticsKeys";
import { calculateTotal } from "@/features/analytics/utils/chartHelpers";
import { useDropdownOptions } from "@/features/analytics/hooks/useDropdownOptions";
import { useActiveKeys } from "@/features/analytics/hooks/useActiveKeys";

type ActiveState = Record<"devices" | "browsers" | "osList", ChartKey[]>;

export function LineCardContainer() {
  const { active, onToggle } = useActiveKeys();

  const [rendered, setRendered] = React.useState<ActiveState>({
    devices: [...devices],
    browsers: [...browsers],
    osList: [...osList],
  });

  const sampleDates = chartDataSample.map((d) => new Date(d.date));
  const minDate = new Date(Math.min(...sampleDates.map((d) => d.getTime())));
  const maxDate = new Date(Math.max(...sampleDates.map((d) => d.getTime())));

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: minDate,
    to: maxDate,
  });

  const allKeys = [...devices, ...browsers, ...osList] as ChartKey[];

  const chartData = React.useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return chartDataSample;

    const sampleMap = new Map(
      chartDataSample.map((d) => [d.date, d] as [string, ChartDataItem])
    );

    const allDates = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to,
    });

    return allDates.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const found = sampleMap.get(dateStr);
      const item: ChartDataItem = { date: dateStr } as ChartDataItem;

      allKeys.forEach((key) => {
        item[key] = found && typeof found[key] === "number" ? found[key] : 0;
      });

      return item;
    });
  }, [dateRange, allKeys]);

  const total = React.useMemo(
    () => calculateTotal(chartData, allKeys),
    [chartData]
  );

  const toggleLine = (type: keyof ActiveState, key: ChartKey) => {
    onToggle(type as any)(key);
    setRendered((prevRendered) => {
      if (!prevRendered[type].includes(key)) {
        return {
          ...prevRendered,
          [type]: [...prevRendered[type], key],
        };
      }
      return prevRendered;
    });
  };

  const dropdowns = useDropdownOptions(active, total, toggleLine);

  return (
    <LineCardUI
      dateRange={dateRange}
      setDateRange={setDateRange}
      dropdowns={dropdowns}
    >
      <AllLineChartContainer
        chartData={chartData}
        active={active}
        rendered={rendered}
      />
    </LineCardUI>
  );
}
