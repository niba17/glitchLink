// src/features/links/components/tables/containers/UserLinkTableContainer.tsx
"use client";

import { useState, useMemo } from "react";
import { UserLinkTableUI } from "../UI/UserLinkTableUI";
import { useUserLinks } from "@/features/links/hooks/useUserLinks";
import { useUserLinkActions } from "@/features/links/hooks/useUserLinkActions";
import { UserLinkDialogs } from "@/features/links/hooks/useUserLinkDialogs";
import { isAfter } from "date-fns";

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
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "mostClicks" | "lessClicks"
  >("newest");

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

    // sorting
    links = [...links].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt ?? "").getTime() -
            new Date(a.createdAt ?? "").getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt ?? "").getTime() -
            new Date(b.createdAt ?? "").getTime()
          );
        case "mostClicks":
          return (b.clicksCount ?? 0) - (a.clicksCount ?? 0);
        case "lessClicks":
          return (a.clicksCount ?? 0) - (b.clicksCount ?? 0);
        default:
          return 0;
      }
    });

    return links;
  }, [search, filter, minClicks, maxClicks, sortBy, userLinks]);

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
      sortBy={sortBy}
      onSortByChange={setSortBy}
    />
  );
}
