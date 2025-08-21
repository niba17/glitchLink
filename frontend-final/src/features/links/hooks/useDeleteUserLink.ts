"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linkService } from "../services/linkService";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastHandler } from "@/hooks/useToastHandler";

export function useDeleteUserLink() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToastHandler();

  return useMutation({
    mutationFn: (id: number) => {
      if (!token) throw new Error("User not authenticated");
      return linkService.deleteUserLink(id, token);
    },
    onSuccess: (data) => {
      showSuccess(data.message || "Link deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["userLinks", token] }); // refetch links
    },
    onError: (err: any) => {
      showError(err?.message || "Failed to delete link");
    },
  });
}
