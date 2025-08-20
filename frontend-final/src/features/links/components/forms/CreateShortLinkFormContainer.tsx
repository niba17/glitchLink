"use client";

import { useState } from "react";
import { ShortLinkPayload } from "../../types/type";
import { useGuestShortLinks } from "../../hooks/useGuestShortLinks";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastHandler } from "@/hooks/useToastHandler";
import CreateShortLinkFormUI from "./CreateShortLinkFormUI";

export default function CreateShortLinkForm() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const { createShortLink } = useGuestShortLinks();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { showSuccess, showError } = useToastHandler();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: ShortLinkPayload = {
      originalUrl,
      customAlias: customAlias || null,
      expiresAt: null,
    };

    if (!isLoggedIn) {
      createShortLink(payload, {
        onSuccess: () => {
          setOriginalUrl("");
          setCustomAlias("");
          showSuccess("Short link created!");
        },
        onError: (err: any) => {
          showError(err.message);
        },
      });
    } else {
      // TODO: user yang login
    }
  };

  return (
    <CreateShortLinkFormUI
      originalUrl={originalUrl}
      customAlias={customAlias}
      onChangeOriginal={setOriginalUrl}
      onChangeAlias={setCustomAlias}
      onSubmit={handleSubmit}
    />
  );
}
