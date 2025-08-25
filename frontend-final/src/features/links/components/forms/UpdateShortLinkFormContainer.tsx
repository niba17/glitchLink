"use client";

import { useState } from "react";
import { toast } from "sonner";
import UpdateShortLinkFormUI from "./UpdateShortLinkFormUI";
import { useUserLinks } from "../../hooks/useUserLinks";

interface UpdateShortLinkFormContainerProps {
  linkId: number;
  currentAlias?: string;
  currentExpiresAt?: string | null;
  onClose: () => void;
}

// FE → BE
function normalizeExpiresAt(val: string | null): string | null {
  if (!val) return null;
  return val.replace("T", " ").replace(/:00$/, "");
}

// BE → FE (buat input datetime-local)
function formatForInput(val: string | null): string | null {
  if (!val) return null;
  return val.replace(" ", "T").slice(0, 16);
}

export default function UpdateShortLinkFormContainer({
  linkId,
  currentAlias = "",
  currentExpiresAt = null,
  onClose,
}: UpdateShortLinkFormContainerProps) {
  const [customAlias, setCustomAlias] = useState(currentAlias);
  const [expiresAt, setExpiresAt] = useState<string | null>(
    formatForInput(currentExpiresAt)
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // updateShortLink sekarang langsung fungsi mutate
  const { updateShortLink, isUpdating } = useUserLinks();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    const payload = {
      id: linkId,
      customAlias,
      expiresAt: normalizeExpiresAt(expiresAt),
    };

    console.log("🚀 payload final:", payload);

    updateShortLink(payload, {
      onSuccess: () => {
        toast.success("Link updated successfully!");
        onClose();
      },
      onError: (error: any) => {
        try {
          const apiError = error.response?.data || error.data;
          if (apiError?.message) toast.error(apiError.message);

          if (Array.isArray(apiError?.errors)) {
            const mapped: Record<string, string> = {};
            apiError.errors.forEach(
              (err: { path: string; message: string }) => {
                mapped[err.path] = err.message;
              }
            );
            setFieldErrors(mapped);
          }
        } catch {
          toast.error("Unexpected error occurred");
        }
      },
    });
  };

  return (
    <UpdateShortLinkFormUI
      customAlias={customAlias}
      expiresAt={expiresAt}
      onChangeAlias={setCustomAlias}
      onChangeExpiresAt={setExpiresAt}
      onSubmit={handleSubmit}
      isPending={isUpdating} // ganti jadi state dari useUserLinks
      fieldErrors={fieldErrors}
    />
  );
}
