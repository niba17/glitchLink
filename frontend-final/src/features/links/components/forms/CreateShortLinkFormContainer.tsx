// frontend-final\src\features\links\components\forms\CreateShortLinkFormContainer.tsx
"use client";

import { useState } from "react";
import { ShortLinkPayload } from "../../types/type";
import { useGuestLinks } from "../../hooks/useGuestLinks";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastHandler } from "@/hooks/useToastHandler";
import CreateGuestShortLinkFormUI from "./CreateGuestShortLinkFormUI";
import CreateUserShortLinkFormUI from "./CreateUserShortLinkFormUI";
// nanti setelah ada hook user -> import { useUserLinks } from "../../hooks/useUserLinks";

export default function CreateShortLinkFormContainer() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");

  const { createShortLink: createGuestShortLink } = useGuestLinks();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { showSuccess, showError } = useToastHandler();

  // TODO: setelah ada hook user
  // const { createShortLink: createUserShortLink } = useUserLinks();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
          showError(err.message);
        },
      });
    } else {
      // sementara pakai console.log, nanti ganti ke useUserLinks
      // createUserShortLink(payload, { ... });
      console.log("User short link created with payload:", payload);
    }
  };

  const sharedProps = {
    originalUrl,
    customAlias,
    onChangeOriginal: setOriginalUrl,
    onChangeAlias: setCustomAlias,
    onSubmit: handleSubmit,
  };

  return isLoggedIn ? (
    <CreateUserShortLinkFormUI {...sharedProps} />
  ) : (
    <CreateGuestShortLinkFormUI {...sharedProps} />
  );
}
