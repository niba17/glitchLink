"use client";

import { useMutation } from "@tanstack/react-query";
import { SignUpPayload, AuthResponse } from "../types/auth";
import { authService } from "../services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastHandler } from "@/hooks/useToastHandler";

export function useSignUp() {
  const { setAuth } = useAuthStore();
  const { showSuccess, showError } = useToastHandler();

  const mutation = useMutation({
    mutationFn: (payload: SignUpPayload) => authService.register(payload),
    onSuccess: (data: AuthResponse) => {
      setAuth({
        isLoggedIn: true,
        email: data?.email || "",
        token: data?.token || "",
      });

      showSuccess(data.message || "Signed Up successfully");
    },
    onError: (err: any) => {
      showError(err?.message || "Failed to Sign Up");
      throw new Error(err?.message || "Failed to sign up");
    },
  });

  return mutation;
}
