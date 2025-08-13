// src/features/links/hooks/useCopyShortLink.ts
import { toast } from "sonner";

export const useCopyShortLink = () => {
  const copyLink = (url: string) => {
    try {
      navigator.clipboard.writeText(url);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return { copyLink };
};
