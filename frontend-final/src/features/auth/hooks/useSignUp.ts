"use client";

import { useMutation } from "@tanstack/react-query";
import { SignUpPayload, AuthResponse } from "../types/auth";
import { authService } from "../services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useToastHandler } from "@/hooks/useToastHandler";

export function useSignUp() {
  const { setLoggedIn } = useAuthStore();
  const { showSuccess, showError } = useToastHandler();

  const mutation = useMutation({
    mutationFn: (payload: SignUpPayload) => authService.register(payload),
    onSuccess: (data: AuthResponse) => {
      setLoggedIn(true);

      if (data.data?.token) {
        localStorage.setItem("authToken", data.data.token);
      }

      showSuccess(data.message || "Signed Up successfully");
    },
    onError: (err: any) => {
      showError(err?.message || "Failed to Sign Up");
      throw new Error(err?.message || "Failed to sign up");
    },
  });

  return mutation;
}
