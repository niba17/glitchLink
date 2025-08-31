"use client";

import { useState } from "react";
import { toast } from "sonner";
import UpdateShortLinkFormUI from "../forms/UpdateShortLinkFormUI";
import { useUserLinks } from "../../hooks/useUserLinks";
import { normalizeExpiresAt, formatForInput } from "../../utils/dateFormatters";

interface UpdateShortLinkFormContainerProps {
  linkId: number;
  currentAlias?: string;
  currentExpiresAt?: string | null;
  onClose: () => void;
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
  const [rootError, setRootError] = useState<string | null>(null);

  // updateShortLink sekarang langsung fungsi mutate
  const { updateShortLink, isUpdating } = useUserLinks();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    setFieldErrors({});
    setRootError(null);

    const payload = {
      id: linkId,
      customAlias,
      expiresAt: normalizeExpiresAt(expiresAt),
    };

    updateShortLink(payload, {
      onSuccess: () => {
        toast.success("Link updated successfully!");
        onClose();
      },
      onError: (error: any) => {
        try {
          const apiError = error.response?.data || error.data;
          if (apiError?.message) {
            setRootError(apiError.message);
            toast.error(apiError.message);
          }

          if (Array.isArray(apiError?.errors)) {
            const mapped: Record<string, string> = {};
            let allEmpty = true;
            apiError.errors.forEach(
              (err: { path: string; message: string }) => {
                mapped[err.path] = err.message;
                if (err.message) allEmpty = false;
              }
            );
            setFieldErrors(mapped);
            if (allEmpty && apiError.message) {
              setRootError(apiError.message);
            }
          }
        } catch {
          setRootError("Unexpected error occurred");
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
      isPending={isUpdating}
      fieldErrors={fieldErrors}
      rootError={rootError ?? undefined}
      onClose={onClose}
    />
  );
}
