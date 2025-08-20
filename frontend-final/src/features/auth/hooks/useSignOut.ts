"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useToastHandler } from "@/hooks/useToastHandler";

export function useSignOut() {
  const { setLoggedIn } = useAuthStore();
  const { showSuccess, showError } = useToastHandler();

  const mutation = useMutation({
    mutationFn: async () => {
      // simulasi delay logout
      return new Promise<void>((resolve) => setTimeout(resolve, 300));
    },
    onSuccess: () => {
      setLoggedIn(false);
      showSuccess("Signed out successfully");
    },
    onError: () => {
      showError("Failed to sign out");
    },
  });

  return mutation;
}
