// frontend-final/src/features/analytics/components/cards/lineCardUI.tsx

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
import { ChartKey } from "@/features/analytics/types/type"; // ✨ Mengimpor ChartKey saja

// ✨ Gunakan kembali interface dari custom hook (atau buat yang baru jika belum ada)
interface DropdownOption {
  key: ChartKey;
  label: string;
  color: string;
  value: number;
  checked: boolean;
  onToggle: () => void;
}

interface LineCardUIProps {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;

  dropdowns: {
    devices: DropdownOption[];
    osList: DropdownOption[];
    browsers: DropdownOption[];
  };

  children: React.ReactNode;
}

export function LineCardUI({
  dateRange,
  setDateRange,
  dropdowns,
  children,
}: LineCardUIProps) {
  const renderDropdown = (label: string, options: DropdownOption[]) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {options.map((opt) => (
          <DropdownMenuCheckboxItem
            key={opt.key}
            checked={opt.checked}
            onCheckedChange={opt.onToggle}
            onSelect={(e: Event) => e.preventDefault()}
            className="justify-between"
          >
            <span className="flex items-center space-x-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: opt.color }}
              />
              <span>{opt.label}</span>
            </span>
            <span>{opt.value.toLocaleString()}</span>
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
            initialRange={dateRange}
            onChange={setDateRange} // ✨ Menghapus as any
          />
          {renderDropdown("Device", dropdowns.devices)}
          {renderDropdown("OS", dropdowns.osList)}
          {renderDropdown("Browser", dropdowns.browsers)}
        </div>
      </CardHeader>

      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}
