"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { SignInPayload } from "../types/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastHandler } from "@/hooks/useToastHandler";

export function useSignIn() {
  const { setLoggedIn } = useAuthStore();
  const { showSuccess, showError } = useToastHandler();

  const mutation = useMutation({
    mutationFn: (payload: SignInPayload) => authService.login(payload),
    onSuccess: (data) => {
      setLoggedIn(true);
      if (data.data?.token) localStorage.setItem("authToken", data.data.token);

      showSuccess(data.message || "User login successfully");
    },
    onError: (err: any) => {
      showError(err?.message || "Signed out successfully");
    },
  });

  return mutation;
}
