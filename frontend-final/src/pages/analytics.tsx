"use client";

import React from "react";
import { DonutPieCardContainer } from "@/features/analytics/components/cards/containers/donutPieCardContainer";
import { LineCardContainer } from "@/features/analytics/components/cards/containers/lineCardContainer";
import { SummarySectionContainer } from "@/features/analytics/components/custom/containers/summarySectionContainer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUserLinks } from "@/features/links/hooks/useUserLinks";
import { UserLink } from "@/features/links/types/type";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const { userLinks, isLoading } = useUserLinks();
  const [selectedShortlink, setSelectedShortlink] = React.useState<
    UserLink | undefined
  >(undefined);

  React.useEffect(() => {
    if (userLinks && userLinks.length > 0 && !selectedShortlink) {
      const defaultLink = userLinks.find((link) => link.shortUrl);
      if (defaultLink) {
        setSelectedShortlink(defaultLink);
      }
    }
  }, [userLinks, selectedShortlink]);

  return (
    <div className="bg-zinc-950 min-h-screen px-[50px] py-5 space-y-5">
      <section>
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-stone-200">
            Shortlink analytics for
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "text-md font-semibold",
                  isLoading && "animate-pulse"
                )}
                disabled={isLoading}
              >
                {isLoading
                  ? "Loading..."
                  : selectedShortlink?.shortUrl || "Pilih Link"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[350px]">
              {userLinks.map((d) => (
                <DropdownMenuItem
                  key={d.id}
                  onSelect={() => setSelectedShortlink(d)}
                  className="justify-start cursor-pointer"
                >
                  <span className="flex flex-col items-start space-y-1">
                    <span className="text-md font-semibold">{d.shortUrl}</span>
                    <span className="text-xs text-stone-500 truncate w-full">
                      {d.originalUrl}
                    </span>
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>
      <section>
        <SummarySectionContainer selectedShortlink={selectedShortlink} />
      </section>
      <section>
        <DonutPieCardContainer
          key={selectedShortlink?.id}
          selectedShortlink={selectedShortlink}
        />
      </section>
      <section>
        {/* <LineCardContainer selectedShortlink={selectedShortlink} /> */}
      </section>
    </div>
  );
}
