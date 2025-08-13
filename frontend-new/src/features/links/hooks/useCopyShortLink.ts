// src/features/links/hooks/useCopyShortLink.ts
import { toast } from "sonner";

export const useCopyShortLink = () => {
  const handleCopyLink = (url: string) => {
    try {
      navigator.clipboard.writeText(url);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy short link");
    }
  };

  return { handleCopyLink };
};
