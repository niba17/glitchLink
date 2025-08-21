// frontend-final/src/features/links/hooks/useUserLinks.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { linkService } from "../services/linkService";
import { UserLink } from "../types/type";
import { useAuthStore } from "@/store/useAuthStore";

export function useUserLinks() {
  const token = useAuthStore((s) => s.token);

  return useQuery<UserLink[], Error>({
    queryKey: ["userLinks", token],
    queryFn: async () => {
      if (!token) throw new Error("User not authenticated");
      return linkService.getUserLinks(token);
    },
    enabled: !!token, // hanya jalan kalau token ada
  });
}
