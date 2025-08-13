"use client";

import { useState } from "react";
import { toast } from "sonner";
import Input from "@/components/inputs/Input";
import Button from "@/components/buttons/Button";

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
      // Parent function harus mengembalikan true jika sukses
      const success = await onSubmit({
        originalUrl: originalUrl.trim(),
        customAlias: customAlias.trim() || null,
      });

      if (success) {
        setOriginalUrl("");
        setCustomAlias("");
      }
    } catch (error) {
      console.error(error);
      // Jangan reset value jika ada error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-[1.7vw]">
        <div className="flex flex-col space-y-[0.7vw]">
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

        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="text-[2vw]"
        >
          {isLoading ? "Processing..." : "Get Short Link"}
        </Button>
      </div>
    </form>
  );
}
