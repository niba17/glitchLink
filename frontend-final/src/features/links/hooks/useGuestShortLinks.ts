// frontend-final\src\features\links\hooks\useGuestShortLinks.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShortLinkPayload, ShortLinkResponse } from "../types/type";
import { shortLinkService } from "../services/shortLinkService";

export interface GuestShortLink {
  id: number;
  originalUrl: string;
  shortUrl: string;
}

const LOCAL_STORAGE_KEY = "guestShortLinks";

// Fetch guest links dari localStorage
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

  // Query untuk guest links
  const query = useQuery<GuestShortLink[]>({
    queryKey: ["guestShortLinks"],
    queryFn: fetchGuestLinks,
  });

  // Mutation untuk create shortLink
  // Mutation untuk create shortLink
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
      // Ambil message spesifik dari backend
      const message =
        err?.errors?.[0]?.message ||
        err?.message ||
        "Failed to create short link";
      // lempar atau teruskan ke form
      throw new Error(message);
    },
  });

  // Mutation untuk delete shortLink
  const deleteMutation = useMutation({
    mutationFn: (id: number): Promise<GuestShortLink[]> => {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed: GuestShortLink[] = stored ? JSON.parse(stored) : [];
      const updated = parsed.filter((link) => link.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return Promise.resolve(updated); // ✅ pastikan return Promise
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["guestShortLinks"], updated); // ✅ gunakan array sebagai key
    },
  });

  return {
    guestLinks: query.data || [],
    isLoading: query.isLoading,
    createShortLink: createMutation.mutate,
    deleteShortLink: deleteMutation.mutate,
  };
}
