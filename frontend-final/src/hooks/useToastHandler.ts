// frontend-final/src/hooks/useToastHandler.ts
"use client";

import { toast } from "sonner";

export function useToastHandler() {
  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showError = (message: string) => {
    toast.error(message);
  };

  return { showSuccess, showError };
}
