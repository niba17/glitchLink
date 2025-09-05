"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUserLinks } from "@/features/links/hooks/useUserLinks";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ShortlinkData {
  key: string;
  originalUrl: string; // Tambahkan properti originalUrl
  clicks: number;
}

export function SummarySectionContainer() {
  const { userLinks, isLoading } = useUserLinks();
  const [selectedShortlink, setSelectedShortlink] = React.useState<
    ShortlinkData | undefined
  >(undefined);

  // Map userLinks from hook to ShortlinkData format
  const shortlinkData = React.useMemo(() => {
    if (!userLinks) return [];
    // Filter out links without a valid shortUrl before mapping
    return userLinks
      .filter((link) => link.shortUrl)
      .map((link) => ({
        key: link.shortUrl!,
        originalUrl: link.originalUrl, // Asumsi properti originalUrl tersedia
        clicks: link.clicksCount,
      }));
  }, [userLinks]);

  // Set default selected shortlink once data is loaded
  React.useEffect(() => {
    if (shortlinkData.length > 0 && !selectedShortlink) {
      setSelectedShortlink(shortlinkData[0]);
    }
  }, [shortlinkData, selectedShortlink]);

  if (isLoading) {
    return (
      <h1 className="text-md font-semibold text-stone-200">
        <span className="animate-pulse">Loading shortlinks...</span>
      </h1>
    );
  }

  if (!selectedShortlink) {
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
              {selectedShortlink.key}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[350px]">
            {shortlinkData.map((d) => (
              <DropdownMenuCheckboxItem
                key={d.key}
                checked={selectedShortlink.key === d.key}
                onCheckedChange={() => setSelectedShortlink(d)}
                onSelect={(e) => e.preventDefault()}
                className="justify-start"
              >
                <span className="flex flex-col items-start space-y-1">
                  <span className="text-md font-semibold">{d.key}</span>
                  <span className="text-xs text-stone-500 truncate w-full">
                    {d.originalUrl}
                  </span>
                </span>
                {/* <span>{d.clicks.toLocaleString()}</span> */}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-3 justify-center space-x-5">
        <Card className="bg-foreground p-0">
          <CardHeader className="pb-0 text-lg font-semibold text-accent">
            Total Clicks
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-bold text-center text-accent">
              {selectedShortlink.clicks.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-foreground p-0">
          <CardHeader className="pb-0 text-lg font-semibold text-accent">
            Traffic Spike
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-bold text-center text-accent">
              {selectedShortlink.clicks.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-foreground p-0">
          <CardHeader className="pb-0 text-lg font-semibold text-accent">
            Traffic Drop
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-bold text-center text-accent">
              {selectedShortlink.clicks.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
