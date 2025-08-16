"use client";

import { useState } from "react";
import { toast } from "sonner";
import { authService, ApiError } from "../services/authService";

export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const signUp = async (payload: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    setFieldErrors({});
    try {
      const res = await authService.signUp(payload);
      toast.success("Account created successfully");
      return res;
    } catch (error: unknown) {
      if (error instanceof ApiError && error.data?.errors) {
        const mapped: Record<string, string> = {};
        error.data.errors.forEach((e: { path: string; message: string }) => {
          mapped[e.path] = e.message;
        });
        setFieldErrors(mapped);

        toast.error(error.data.message || "Failed to sign up");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to sign up");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // tambahan: fungsi untuk reset error manual
  const resetErrors = () => setFieldErrors({});

  return { signUp, loading, fieldErrors, resetErrors };
}
