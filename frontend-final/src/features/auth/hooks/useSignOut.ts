// frontend-final/src/features/auth/hooks/useSignOut.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastHandler } from "@/hooks/useToastHandler";

export function useSignOut() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { showSuccess, showError } = useToastHandler();

  return useMutation({
    mutationFn: async () => {
      // kalau ada API logout bisa dipanggil di sini
      return true;
    },
    onSuccess: () => {
      showSuccess("Signed out successfully");
      clearAuth(); // otomatis clear localStorage juga karena persist
    },
    onError: () => {
      showError("Sign out failed");
    },
  });
}
