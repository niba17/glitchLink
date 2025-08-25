"use client";

import { useState } from "react";
import { ShortLinkPayload } from "../../types/type";
import { useGuestLinks } from "../../hooks/useGuestLinks";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastHandler } from "@/hooks/useToastHandler";
import CreateGuestShortLinkFormUI from "./CreateGuestShortLinkFormUI";
import CreateUserShortLinkFormUI from "./CreateUserShortlinkFormUI";
import { useCreateUserLink } from "../../hooks/useCreateUserLink";

interface Props {
  onClose?: () => void; // <- tambahkan prop
}

// FE → BE: hapus detik, ganti T → spasi
function normalizeExpiresAt(val: string | null): string | null {
  if (!val) return null;
  return val.replace("T", " ").replace(/:00$/, "");
}

// BE → FE: format agar bisa di-input datetime-local
function formatForInput(val: string | null): string | null {
  if (!val) return null;
  return val.replace(" ", "T").slice(0, 16);
}

export default function CreateShortLinkFormContainer({ onClose }: Props) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState<string>(
    formatForInput(null) ?? "" // jika null → ""
  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { createShortLink: createGuestShortLink } = useGuestLinks();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { showSuccess, showError } = useToastHandler();
  const { mutate: createUserShortLink } = useCreateUserLink();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    const payload: ShortLinkPayload = {
      originalUrl,
      customAlias: customAlias || null,
      expiresAt: normalizeExpiresAt(expiresAt),
    };

    const handleSuccess = (msg: string) => {
      setOriginalUrl("");
      setCustomAlias("");
      showSuccess(msg);
      if (onClose) onClose(); // <- tutup dialog
    };

    const handleError = (err: any) => {
      const apiError = err.response?.data || err.data || err;
      if (apiError?.errors && Array.isArray(apiError.errors)) {
        const mapped: Record<string, string> = {};
        apiError.errors.forEach((e: { path: string; message: string }) => {
          mapped[e.path] = e.message;
        });
        setFieldErrors(mapped);
      }

      showError(
        apiError?.message ||
          apiError?.errors?.[0]?.message ||
          "Failed to create link"
      );
    };

    if (!isLoggedIn) {
      createGuestShortLink(payload, {
        onSuccess: () => handleSuccess("Guest short link created!"),
        onError: handleError,
      });
    } else {
      createUserShortLink(payload, {
        onSuccess: () => handleSuccess("User short link created!"),
        onError: handleError,
      });
    }
  };

  const sharedProps = {
    originalUrl,
    customAlias,
    expiresAt,
    onChangeOriginal: setOriginalUrl,
    onChangeAlias: setCustomAlias,
    onChangeExpiresAt: setExpiresAt,
    onSubmit: handleSubmit,
    fieldErrors,
  };

  return isLoggedIn ? (
    <CreateUserShortLinkFormUI {...sharedProps} expiresAt={expiresAt ?? ""} />
  ) : (
    <CreateGuestShortLinkFormUI
      {...sharedProps}
      expiresAt={expiresAt ?? ""} // pastikan selalu string
    />
  );
}
