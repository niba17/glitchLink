"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ShortLinkPayload,
  GuestLink,
  GuestLinkUI,
  ShortLinkResponse,
} from "../types/type";
import { mapGuestLinksToUI } from "../utils/mapGuestLinksToUI";
import { linkService } from "../services/linkService";

const LOCAL_STORAGE_KEY = "guestLinks";

function fetchGuestLinks(): GuestLink[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed: GuestLink[] = JSON.parse(stored);
    return parsed;
  } catch {
    return [];
  }
}

export function useGuestLinks() {
  const queryClient = useQueryClient();

  const query = useQuery<GuestLink[]>({
    queryKey: [LOCAL_STORAGE_KEY],
    queryFn: fetchGuestLinks,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: ShortLinkPayload) => {
      const res: ShortLinkResponse = await linkService.createShortLink(payload);

      const newLink: GuestLink = {
        id: res.data.id,
        originalUrl: res.data.originalUrl,
        shortUrl: res.data.shortUrl,
        shortCode: res.data.customAlias || res.data.shortCode || null,
        createdAt: res.data.createdAt || new Date().toISOString(),
      };

      return newLink;
    },
    onSuccess: (newLink) => {
      const prev =
        queryClient.getQueryData<GuestLink[]>([LOCAL_STORAGE_KEY]) || [];
      const updated = [newLink, ...prev];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      queryClient.setQueryData([LOCAL_STORAGE_KEY], updated);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number): Promise<GuestLink[]> => {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed: GuestLink[] = stored ? JSON.parse(stored) : [];
      const updated = parsed.filter((link) => link.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return Promise.resolve(updated);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData([LOCAL_STORAGE_KEY], updated);
    },
  });

  const uiGuestLinks: GuestLinkUI[] = query.data
    ? mapGuestLinksToUI(query.data)
    : [];

  return {
    guestLinks: query.data || [],
    uiGuestLinks,
    isLoading: query.isLoading,
    createShortLink: createMutation.mutate,
    deleteShortLink: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
}
