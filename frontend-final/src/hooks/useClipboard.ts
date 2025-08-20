// frontend-final/src/hooks/useClipboard.ts
"use client";

import { GUEST_SHORT_LINK_STRINGS } from "@/features/links/constants/strings";
import { useState } from "react";
import { toast } from "sonner";

export function useClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string, showToast = true) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (showToast) toast.success(GUEST_SHORT_LINK_STRINGS.copySuccess);
      setTimeout(() => setCopied(false), 2000); // reset state setelah 2 detik
    } catch (err) {
      setCopied(false);
      toast.error(GUEST_SHORT_LINK_STRINGS.copyError);
    }
  };

  return { copied, copy };
}
