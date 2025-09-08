"use client";

import { useState } from "react";
import { ShortLinkPayload } from "../../../types/type";
import { useGuestLinks } from "../../../hooks/useGuestLinks";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastHandler } from "@/hooks/useToastHandler";
import CreateGuestShortLinkFormUI from "../UI/CreateGuestShortLinkFormUI";
import CreateUserShortLinkFormUI from "../UI/CreateUserShortlinkFormUI";
import { useUserLinks } from "../../../hooks/useUserLinks";
import {
  normalizeExpiresAt,
  formatForInput,
} from "../../../utils/dateFormatters";

interface Props {
  onClose?: () => void;
}

export default function CreateShortLinkFormContainer({ onClose }: Props) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState<string>(
    formatForInput(null) ?? ""
  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [rootError, setRootError] = useState<string | null>(null);

  const { createShortLink: createGuestShortLink } = useGuestLinks();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { showSuccess, showError } = useToastHandler();
  const { createShortLink: createUserShortLink } = useUserLinks();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    setFieldErrors({});
    setRootError(null);

    const payload: ShortLinkPayload = {
      originalUrl,
      customAlias: customAlias || null,
      expiresAt: normalizeExpiresAt(expiresAt),
    };

    const handleSuccess = (msg: string) => {
      setOriginalUrl("");
      setCustomAlias("");
      showSuccess(msg);
      if (onClose) onClose();
    };

    const handleError = (err: any) => {
      // ambil payload dari AxiosError
      const apiError = err.response?.data || err.data || err;

      if (Array.isArray(apiError?.errors)) {
        const mapped: Record<string, string> = {};
        apiError.errors.forEach((e: { path: string; message: string }) => {
          mapped[e.path] = e.message;
        });
        setFieldErrors(mapped);
        // kalau BE kasih message umum juga, taruh di rootError
        if (apiError.message) {
          setRootError(apiError.message);
        }
      } else if (apiError?.message) {
        setRootError(apiError.message);
      }

      showError(apiError?.message || "Failed to create link");
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
    <CreateUserShortLinkFormUI
      {...sharedProps}
      expiresAt={expiresAt ?? ""}
      rootError={rootError ?? undefined}
      onClose={onClose}
    />
  ) : (
    <CreateGuestShortLinkFormUI {...sharedProps} expiresAt={expiresAt ?? ""} />
  );
}
