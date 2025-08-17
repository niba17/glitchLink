// frontend-new/src/features/shortLinks/components/forms/UpdateShortLinkForm.tsx
"use client";

import { useEffect, useState } from "react";
import Input from "@/components/inputs/Input";
import Button from "@/components/buttons/Button";
import Modal from "@/components/modals/Modal";
import { ShortLink } from "../../types/type";

interface UpdateShortLinkFormProps {
  isOpen: boolean;
  onClose: () => void;
  // ✅ Menggunakan shortLink sebagai nama properti
  shortLink: ShortLink | null;
  onSubmit: (data: {
    customAlias?: string | null;
    expiresAt?: string | null;
  }) => Promise<void>;
  isLoading: boolean;
  fieldErrors?: { customAlias?: string; expiresAt?: string };
}

export default function UpdateShortLinkForm({
  isOpen,
  onClose,
  // ✅ Destructuring shortLink
  shortLink,
  onSubmit,
  isLoading,
  fieldErrors,
}: UpdateShortLinkFormProps) {
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  useEffect(() => {
    // ✅ Menggunakan shortLink
    if (shortLink) {
      setCustomAlias(shortLink.customAlias || "");
      // Memastikan format datetime-local (YYYY-MM-DDTHH:MM)
      setExpiresAt(
        shortLink.expiresAt
          ? new Date(shortLink.expiresAt).toISOString().slice(0, 16)
          : ""
      );
    }
  }, [shortLink]); // ✅ Dependensi pada shortLink

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortLink) return;

    await onSubmit({
      // ✅ Ganti customAlias.trim() || null menjadi customAlias.trim()
      // Ini akan mengirim string kosong "" jika input dikosongkan.
      customAlias: customAlias.trim(),
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Short Link">
      <form onSubmit={handleSubmit} aria-busy={isLoading}>
        <div className="flex flex-col space-y-[0.6vw]">
          <div className="flex flex-col space-y-[0.1vw]">
            <Input
              label="Alias"
              placeholder="your-alias"
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              error={fieldErrors?.customAlias}
            />

            <Input
              label="Expires At (optional)"
              placeholder="YYYY-MM-DDTHH:MM"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              error={fieldErrors?.expiresAt}
            />
          </div>

          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Short Link"}
          </Button>
        </div>
      </form>
      <style>{`
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          filter: invert(1); 
          color: #e7e5e4; 
        }
      `}</style>
    </Modal>
  );
}
