// frontend-final/src/hooks/useClipboard.ts
"use client";

import { useState } from "react";
import { toast } from "sonner";

export function useClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string, showToast = true) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (showToast) toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000); // reset state setelah 2 detik
    } catch (err) {
      setCopied(false);
      toast.error("Failed to copy");
    }
  };

  return { copied, copy };
}
