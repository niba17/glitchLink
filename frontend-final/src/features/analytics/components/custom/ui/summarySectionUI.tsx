// Lokasi: frontend-final\src\features\analytics\components\custom/ui/summarySectionUI.tsx
"use client";

import React, { SetStateAction, Dispatch } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TotalClickCardContainer } from "../../cards/containers/totalClickCardContainer";
import { TrafficSpikeCardContainer } from "../../cards/containers/trafficSpikeCardContainer";
import { TrafficDropCardContainer } from "../../cards/containers/trafficDropCardContainer";
import { Link2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface ShortlinkData {
  id: number;
  key: string;
  originalUrl: string;
  clicks: number;
}

interface SummarySectionUIProps {
  shortlinkData: ShortlinkData[];
  selectedShortlink?: ShortlinkData;
  setSelectedShortlink: Dispatch<SetStateAction<ShortlinkData | undefined>>;
  isLoading: boolean;
}

export function SummarySectionUI({
  shortlinkData,
  selectedShortlink,
  setSelectedShortlink,
  isLoading,
}: SummarySectionUIProps) {
  if (isLoading) {
    return (
      <h1 className="text-md font-semibold text-stone-200">
        <span className="animate-pulse">Loading shortlinks...</span>
      </h1>
    );
  }

  if (shortlinkData.length === 0) {
    return (
      <h1 className="text-md font-semibold text-stone-200">
        No shortlinks available.
      </h1>
    );
  }

  return (
    <div className="flex flex-col space-y-5">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-bold text-stone-200">
          Shortlink analytics for
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-md font-semibold">
              {selectedShortlink?.key || "Pilih Link"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[350px]">
            {shortlinkData.map((d) => (
              <DropdownMenuItem
                key={d.id}
                onSelect={() => setSelectedShortlink(d)}
                className="justify-start cursor-pointer"
              >
                <span className="flex flex-col items-start space-y-1">
                  <span className="text-md font-semibold">{d.key}</span>
                  <span className="text-xs text-stone-500 truncate w-full">
                    {d.originalUrl}
                  </span>
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-3 justify-center space-x-5">
        <TotalClickCardContainer shortlinkId={selectedShortlink?.id} />
        <TrafficSpikeCardContainer shortlinkId={selectedShortlink?.id} />
        <TrafficDropCardContainer shortlinkId={selectedShortlink?.id} />
      </div>
    </div>
  );
}
