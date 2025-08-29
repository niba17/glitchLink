"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastHandler } from "@/hooks/useToastHandler";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { authService } from "../services/authService";
import { SignInPayload, SignUpPayload, AuthResponse } from "../types/auth";

export function useAuth() {
  const { setAuth, clearAuth } = useAuthStore();
  const { showSuccess, showError } = useToastHandler();
  const router = useRouter();

  // Semua useMutation dipanggil di level top
  const signInMutation = useMutation({
    mutationFn: (payload: SignInPayload) => authService.login(payload),
    onSuccess: (data) => {
      setAuth({
        isLoggedIn: true,
        email: data?.email || "",
        token: data?.token || "",
      });
      showSuccess(data.message || "User login successfully");
      router.replace("/links");
    },
    onError: (err: any) => {
      let msg = "User login failed";
      if ((err as AxiosError).isAxiosError) {
        const axiosErr = err as AxiosError<any>;
        const responseData = axiosErr.response?.data;
        if (responseData) {
          const firstError = responseData.errors?.find(
            (e: any) => e.message && e.message.trim() !== ""
          )?.message;
          msg = firstError || responseData.message || msg;
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      showError(msg);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (payload: SignUpPayload) => authService.register(payload),
    onSuccess: (data) => {
      setAuth({
        isLoggedIn: true,
        email: data?.email || "",
        token: data?.token || "",
      });
      showSuccess(data.message || "Signed up successfully");
    },
    onError: (err: any) => {
      showError(err?.message || "Failed to Sign Up");
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async () => true, // kalau ada API logout, panggil di sini
    onSuccess: () => {
      clearAuth();
      showSuccess("Signed out successfully");
    },
    onError: () => showError("Sign out failed"),
  });

  return {
    signIn: signInMutation.mutate,
    signUp: signUpMutation.mutate,
    signOut: signOutMutation.mutate,
    signInStatus: signInMutation.status,
    signUpStatus: signUpMutation.status,
    signOutStatus: signOutMutation.status,
  };
}
