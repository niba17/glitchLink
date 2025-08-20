// frontend-final\src\features\links\components\forms\CreateShortLinkForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { ShortLinkPayload } from "../../types/type";
import { useGuestShortLinks } from "../../hooks/useGuestShortLinks";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastHandler } from "@/hooks/useToastHandler";

interface CreateShortLinkFormProps {
  onCreated?: (shortUrl: string) => void;
  defaultOriginalUrl?: string;
  defaultCustomAlias?: string;
}

export default function CreateShortLinkForm({
  onCreated,
  defaultOriginalUrl = "",
  defaultCustomAlias = "",
}: CreateShortLinkFormProps) {
  const [originalUrl, setOriginalUrl] = useState(defaultOriginalUrl);
  const [customAlias, setCustomAlias] = useState(defaultCustomAlias);
  const { showSuccess, showError } = useToastHandler();

  // Ambil status login dari store
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // Gunakan hook guest shortLinks
  const { createShortLink } = useGuestShortLinks();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: ShortLinkPayload = {
      originalUrl,
      customAlias: customAlias || null,
      expiresAt: null,
    };

    if (!isLoggedIn) {
      createShortLink(payload, {
        onSuccess: (link) => {
          setOriginalUrl("");
          setCustomAlias("");
          showSuccess("Short link created!");
        },
        onError: (err: any) => {
          showError(err.message);
        },
      });
    }
  };

  return (
    <div>
      <form className="flex flex-col space-y-10" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <Label className="text-lg" htmlFor="originalUrl">
              Original Link
            </Label>
            <Input
              id="originalUrl"
              placeholder="https://example.com"
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label className="text-lg" htmlFor="customAlias">
              Alias (Optional)
            </Label>
            <Input
              id="customAlias"
              placeholder="your-alias"
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="default"
          className="text-[2vw] h-14 mt-10"
        >
          Get Short Link
        </Button>
      </form>
    </div>
  );
}
