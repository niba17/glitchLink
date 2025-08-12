"use client";

import { useState } from "react";
import { toast } from "sonner";
import Input from "@/components/input/Input";
import Button from "@/components/button/Button";

interface CreateLinkFormProps {
  onSubmit: (data: {
    originalUrl: string;
    customAlias?: string | null;
  }) => Promise<void> | void;
  isLoading?: boolean;
  fieldErrors?: { [key: string]: string };
}

export default function CreateLinkForm({
  onSubmit,
  isLoading = false,
  fieldErrors = {},
}: CreateLinkFormProps) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!originalUrl.trim()) {
      toast.error("Original link is required");
      return;
    }

    try {
      await onSubmit({
        originalUrl: originalUrl.trim(),
        customAlias: customAlias.trim() || null,
      });

      // Jika tidak error, reset input
      setOriginalUrl("");
      setCustomAlias("");
    } catch {
      // Jika error, jangan reset input
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-[2vw]">
        <div className="flex flex-col gap-[1vw]">
          <Input
            label="Original Link"
            placeholder="https://example.com"
            type="url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            error={fieldErrors.originalUrl}
          />

          <Input
            label="Alias (optional)"
            placeholder="your-alias"
            type="text"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
            error={fieldErrors.customAlias}
          />
        </div>

        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Processing..." : "Get Short Link"}
        </Button>
      </div>
    </form>
  );
}
