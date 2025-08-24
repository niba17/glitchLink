"use client";

import { useState } from "react";
import { ShortLinkPayload } from "../../types/type";
import { useGuestLinks } from "../../hooks/useGuestLinks";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastHandler } from "@/hooks/useToastHandler";
import CreateGuestShortLinkFormUI from "./CreateGuestShortLinkFormUI";
import CreateUserShortLinkFormUI from "./CreateUserShortLinkFormUI";
import { useCreateUserLink } from "../../hooks/useCreateUserLink";

interface Props {
  onClose?: () => void; // <- tambahkan prop
}

export default function CreateShortLinkFormContainer({ onClose }: Props) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
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
      expiresAt: null,
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
    onChangeOriginal: setOriginalUrl,
    onChangeAlias: setCustomAlias,
    onSubmit: handleSubmit,
    fieldErrors,
  };

  return isLoggedIn ? (
    <CreateUserShortLinkFormUI {...sharedProps} />
  ) : (
    <CreateGuestShortLinkFormUI {...sharedProps} />
  );
}
