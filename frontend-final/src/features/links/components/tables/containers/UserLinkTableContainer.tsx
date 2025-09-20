// src/features/links/components/tables/containers/UserLinkTableContainer.tsx
"use client";

import { useState, useMemo } from "react";
import { UserLinkTableUI } from "../UI/UserLinkTableUI";
import { useUserLinks } from "@/features/links/hooks/useUserLinks";
import { useUserLinkActions } from "@/features/links/hooks/useUserLinkActions";
import { UserLinkDialogs } from "@/features/links/hooks/useUserLinkDialogs";
import { isAfter } from "date-fns";

// src/features/links/components/tables/containers/UserLinkTableContainer.tsx

export function UserLinkTableContainer({
  dialogs,
}: {
  dialogs: UserLinkDialogs;
}) {
  const { data: userLinks = [], deleteShortLinkAsync } = useUserLinks();
  const { onCopy, onEdit, onDelete, onVisit } = useUserLinkActions({
    dialogs,
    deleteShortLink: deleteShortLinkAsync,
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");
  const [minClicks, setMinClicks] = useState<number | null>(null);
  const [maxClicks, setMaxClicks] = useState<number | null>(null);

  const filteredLinks = useMemo(() => {
    let links = userLinks;

    // search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      links = links.filter((link) => {
        return (
          link.shortUrl?.toLowerCase().includes(q) ||
          link.customAlias?.toLowerCase().includes(q) ||
          link.shortCode?.toLowerCase().includes(q) ||
          link.originalUrl?.toLowerCase().includes(q)
        );
      });
    }

    // active/expired filter
    if (filter !== "all") {
      links = links.filter((link) => {
        const isActive =
          !link.expiresAt || isAfter(new Date(link.expiresAt), new Date());
        return filter === "active" ? isActive : !isActive;
      });
    }

    // min/max clicks filter
    if (minClicks !== null) {
      links = links.filter((link) => (link.clicksCount ?? 0) >= minClicks);
    }
    if (maxClicks !== null) {
      links = links.filter((link) => (link.clicksCount ?? 0) <= maxClicks);
    }

    return links;
  }, [search, filter, minClicks, maxClicks, userLinks]);

  return (
    <UserLinkTableUI
      data={filteredLinks}
      search={search}
      onSearchChange={setSearch}
      onCopy={onCopy}
      onEdit={onEdit}
      onDelete={onDelete}
      onVisit={onVisit}
      filter={filter}
      onFilterChange={setFilter}
      minClicks={minClicks}
      maxClicks={maxClicks}
      onMinClicksChange={setMinClicks}
      onMaxClicksChange={setMaxClicks}
    />
  );
}
