// frontend-final/src/features/auth/hooks/useSignIn.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { SignInPayload } from "../types/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastHandler } from "@/hooks/useToastHandler";
import { useRouter } from "next/navigation";

export function useSignIn() {
  const { setAuth } = useAuthStore();
  const { showSuccess, showError } = useToastHandler();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (payload: SignInPayload) => authService.login(payload),
    onSuccess: (data) => {
      setAuth({
        isLoggedIn: true,
        email: data?.email || "",
        token: data?.token || "",
      });

      if (data.token) localStorage.setItem("authToken", data.token);

      showSuccess(data.message || "User login successfully");

      // redirect otomatis ke /links
      router.replace("/links");
    },
    onError: (err: any) => {
      showError(err?.message || "Signed out successfully");
    },
  });

  return mutation;
}
