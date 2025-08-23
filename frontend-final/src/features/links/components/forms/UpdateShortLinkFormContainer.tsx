"use client";

import { useState, useEffect } from "react";
import { useUpdateUserLink } from "../../hooks/useUpdateUserLink";
import { useToastHandler } from "@/hooks/useToastHandler";
import UpdateShortLinkFormUI from "./UpdateShortLinkFormUI";

interface UpdateShortLinkFormContainerProps {
  linkId: number | null;
  currentAlias: string;
  currentExpiresAt: string;
  onClose: () => void;
}

export default function UpdateShortLinkFormContainer({
  linkId,
  currentAlias,
  currentExpiresAt,
  onClose,
}: UpdateShortLinkFormContainerProps) {
  const [customAlias, setCustomAlias] = useState(currentAlias || "");
  const [expiresAt, setExpiresAt] = useState(currentExpiresAt || "");

  const { mutate: updateLink, isPending } = useUpdateUserLink();
  const { showSuccess, showError } = useToastHandler();

  useEffect(() => {
    setCustomAlias(currentAlias || "");
    setExpiresAt(currentExpiresAt || "");
  }, [currentAlias, currentExpiresAt]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!linkId) return;

    let formattedExpiresAt: string | null = null;
    if (expiresAt) {
      formattedExpiresAt = new Date(expiresAt).toISOString();
    }

    updateLink(
      { id: linkId, customAlias, expiresAt: formattedExpiresAt },
      {
        onSuccess: () => {
          showSuccess("Link updated successfully!");
          onClose();
        },
        onError: (err: any) => {
          showError(err.message);
        },
      }
    );
  };

  return (
    <UpdateShortLinkFormUI
      customAlias={customAlias}
      expiresAt={expiresAt}
      onChangeAlias={setCustomAlias}
      onChangeExpiresAt={setExpiresAt}
      onSubmit={handleSubmit}
      isPending={isPending}
    />
  );
}
