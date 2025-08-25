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
      // tampilkan toast hanya dari message root (data.message) jika ada
      if (err?.response?.data?.message) {
        showError(err.response.data.message);
      } else {
        showError(err?.message || "Failed to Sign Up");
      }
      // jangan lempar error lagi, biar container bisa ambil data.errors & data.message
    },
  });

  return mutation;
}
