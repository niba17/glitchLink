"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShortLinkPayload } from "../types/type";
import { shortLinkService } from "../services/shortLinkService";
import { GuestShortLink, GuestShortLinkUI } from "../types/type";
import { mapGuestLinksToUI } from "../utils/mapGuestLinksToUI";

const LOCAL_STORAGE_KEY = "guestShortLinks";

function fetchGuestLinks(): GuestShortLink[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed: (GuestShortLink | null)[] = JSON.parse(stored);
    return parsed.filter((link): link is GuestShortLink => link !== null);
  } catch {
    return [];
  }
}

export function useGuestShortLinks() {
  const queryClient = useQueryClient();

  const query = useQuery<GuestShortLink[]>({
    queryKey: ["guestShortLinks"],
    queryFn: fetchGuestLinks,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: ShortLinkPayload) => {
      const res = await shortLinkService.createShortLink(payload);
      return res.data;
    },
    onSuccess: (newLink) => {
      const prev =
        queryClient.getQueryData<GuestShortLink[]>([LOCAL_STORAGE_KEY]) || [];
      const updated = [newLink, ...prev];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      queryClient.setQueryData([LOCAL_STORAGE_KEY], updated);
    },
    onError: (err: any) => {
      const message =
        err?.errors?.[0]?.message ||
        err?.message ||
        "Failed to create short link";
      throw new Error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number): Promise<GuestShortLink[]> => {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed: GuestShortLink[] = stored ? JSON.parse(stored) : [];
      const updated = parsed.filter((link) => link.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return Promise.resolve(updated);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["guestShortLinks"], updated);
    },
  });

  // langsung map ke UI
  const uiGuestLinks: GuestShortLinkUI[] = query.data
    ? mapGuestLinksToUI(query.data)
    : [];

  return {
    guestLinks: query.data || [],
    uiGuestLinks,
    isLoading: query.isLoading,
    createShortLink: createMutation.mutate,
    deleteShortLink: deleteMutation.mutate,
  };
}
