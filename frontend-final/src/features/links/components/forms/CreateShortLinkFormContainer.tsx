"use client";

import { useState } from "react";
import { ShortLinkPayload } from "../../types/type";
import { useGuestLinks } from "../../hooks/useGuestLinks";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastHandler } from "@/hooks/useToastHandler";
import CreateGuestShortLinkFormUI from "./CreateGuestShortLinkFormUI";
import CreateUserShortLinkFormUI from "./CreateUserShortLinkFormUI";

export default function CreateShortLinkFormContainer() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { createShortLink: createGuestShortLink } = useGuestLinks();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { showSuccess, showError } = useToastHandler();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    const payload: ShortLinkPayload = {
      originalUrl,
      customAlias: customAlias || null,
      expiresAt: null,
    };

    if (!isLoggedIn) {
      createGuestShortLink(payload, {
        onSuccess: () => {
          setOriginalUrl("");
          setCustomAlias("");
          showSuccess("Guest short link created!");
        },
        onError: (err: any) => {
          // Parsing backend error
          const apiError = err.response?.data || err.data || err;
          if (apiError?.errors && Array.isArray(apiError.errors)) {
            const mapped: Record<string, string> = {};
            apiError.errors.forEach((e: { path: string; message: string }) => {
              mapped[e.path] = e.message;
            });
            setFieldErrors(mapped);
          }

          // tampilkan toast
          showError(
            apiError?.message ||
              apiError?.errors?.[0]?.message ||
              "Failed to create link"
          );
        },
      });
    } else {
      console.log("User short link created with payload:", payload);
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
