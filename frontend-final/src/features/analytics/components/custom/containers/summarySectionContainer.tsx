// Lokasi: frontend-final\src\features\analytics\components\custom\containers\summarySectionContainer.tsx
"use client";

import React from "react";
import { useUserLinks } from "@/features/links/hooks/useUserLinks";
import { SummarySectionUI } from "../ui/summarySectionUI";
import { UserLink } from "@/features/links/types/type";

interface ShortlinkData {
  id: number;
  key: string;
  originalUrl: string;
  clicks: number;
}

export function SummarySectionContainer() {
  const { userLinks, isLoading } = useUserLinks();
  const [selectedShortlink, setSelectedShortlink] = React.useState<
    ShortlinkData | undefined
  >(undefined);

  const shortlinkData = React.useMemo(() => {
    if (!userLinks) return [];
    return userLinks
      .filter((link) => link.shortUrl)
      .map((link) => ({
        id: link.id,
        key: link.shortUrl!,
        originalUrl: link.originalUrl,
        clicks: link.clicksCount,
      }));
  }, [userLinks]);

  React.useEffect(() => {
    if (shortlinkData.length > 0 && !selectedShortlink) {
      setSelectedShortlink(shortlinkData[0]);
    }
  }, [shortlinkData, selectedShortlink]);

  return (
    <SummarySectionUI
      shortlinkData={shortlinkData}
      selectedShortlink={selectedShortlink}
      setSelectedShortlink={setSelectedShortlink}
      isLoading={isLoading}
    />
  );
}
