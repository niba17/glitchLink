"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authService, ApiError } from "../services/authService";

export function useSignIn() {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const signIn = async (payload: { email: string; password: string }) => {
    setLoading(true);
    setFieldErrors({});
    try {
      const res = await authService.signIn(payload);
      toast.success("Signed in successfully");
      return res;
    } catch (error: unknown) {
      if (error instanceof ApiError && error.data?.message) {
        // Ambil message dari BE
        toast.error(error.data.message);

        // Mapping field errors
        const mapped: Record<string, string> = {};
        error.data.errors?.forEach((e: { path: string; message: string }) => {
          mapped[e.path] = error.data.message; // tampilkan "Invalid credential"
        });
        setFieldErrors(mapped);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to sign in");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetErrors = () => setFieldErrors({});

  return { signIn, loading, fieldErrors, resetErrors };
}
