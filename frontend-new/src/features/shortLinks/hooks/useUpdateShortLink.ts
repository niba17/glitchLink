// frontend-new/src/features/shortLinks/hooks/useUpdateShortLink.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shortLinkService, ApiError } from "../services/shortLinkService";
import { toast } from "sonner"; // ✅ Tambahkan ini untuk notifikasi

export function useUpdateShortLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { customAlias?: string | null; expiresAt?: string | null };
    }) => shortLinkService.handleUpdateLink(id, payload),

    onSuccess: () => {
      // ✅ Ini akan memberitahu React Query untuk me-refetch data 'shortLinks'
      queryClient.invalidateQueries({ queryKey: ["shortLinks"] });
      toast.success("Short link berhasil diperbarui!"); // ✅ Tambahkan notifikasi sukses
    },

    onError: (error: ApiError) => {
      console.error("Update short link failed:", error);
      // ✅ Tampilkan pesan error ke pengguna
      toast.error(error.message || "Gagal memperbarui short link");
    },
  });
}
