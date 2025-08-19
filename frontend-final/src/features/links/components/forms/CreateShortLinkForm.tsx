"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useCreateShortLink } from "../../hooks/useCreateShortLink";
import { ShortLinkPayload, ShortLinkResponse } from "../../types/type";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

interface CreateShortLinkFormProps {
  onCreated?: (shortUrl: string) => void;
  defaultOriginalUrl?: string;
  defaultCustomAlias?: string;
  isGuest?: boolean;
}

export default function CreateShortLinkForm({
  onCreated,
  defaultOriginalUrl = "",
  defaultCustomAlias = "",
}: CreateShortLinkFormProps) {
  const [originalUrl, setOriginalUrl] = useState(defaultOriginalUrl);
  const [customAlias, setCustomAlias] = useState(defaultCustomAlias);
  const [guestLinks, setGuestLinks] = useState<ShortLinkResponse["data"][]>([]);

  // Ambil status login dari store
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isGuest = !isLoggedIn;

  // Load guest shortlinks dari localStorage
  useEffect(() => {
    if (isGuest) {
      const stored = localStorage.getItem("guestShortLinks");
      if (stored) setGuestLinks(JSON.parse(stored));
    }
  }, [isGuest]);

  const mutation = useCreateShortLink({
    onSuccess: (data) => {
      const link = data.data; // ambil dari response BE
      setOriginalUrl("");
      setCustomAlias("");
      onCreated?.(link.shortUrl);

      // tampilkan toast sukses
      toast.success(data.message);

      // simpan ke localStorage jika guest
      if (isGuest) {
        setGuestLinks((prev) => {
          const updated = [link, ...prev];
          localStorage.setItem("guestShortLinks", JSON.stringify(updated));
          return updated;
        });
      }
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create short link");
    },
  });

  const isLoading = mutation.status === "pending";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: ShortLinkPayload = {
      originalUrl,
      customAlias: customAlias || null,
      expiresAt: null,
    };
    mutation.mutate(payload);
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
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Get Short Link"}
        </Button>
      </form>
    </div>
  );
}
