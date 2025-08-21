"use client";

import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { SignInPayload } from "../types/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastHandler } from "@/hooks/useToastHandler";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

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

      showSuccess(data.message || "User login successfully");

      // redirect otomatis ke /links
      router.replace("/links");
    },

    onError: (err: any) => {
      let msg = "User login failed";

      if ((err as AxiosError).isAxiosError) {
        const axiosErr = err as AxiosError<any>;
        const responseData = axiosErr.response?.data;

        if (responseData) {
          // ambil pesan pertama yang valid dari errors, kalau kosong pakai message utama
          const firstError = responseData.errors?.find(
            (e: any) => e.message && e.message.trim() !== ""
          )?.message;
          msg = firstError || responseData.message || msg;
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }

      showError(msg); // toast hanya muncul sekali
    },
  });

  return mutation;
}
