// src/components/modal/links/EditLinkModal.tsx
"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/modal/Modal";
import { updateLink } from "@/lib/api";
import Toast from "@/components/toast/Toast";
import { Button } from "@/components/button/Button";

interface EditLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkData: {
    id: string;
    shortUrl: string;
    customAlias?: string;
    expiresAt?: string | null;
  } | null;
  onSuccess: () => void;
}

export default function EditLinkModal({
  isOpen,
  onClose,
  linkData,
  onSuccess,
}: EditLinkModalProps) {
  const [customAlias, setAlias] = useState("");
  const [expiresAt, setExpiredAt] = useState("");

  useEffect(() => {
    if (linkData) {
      setAlias(linkData.customAlias || "");
      setExpiredAt(linkData.expiresAt ? linkData.expiresAt.split("T")[0] : "");
    }
  }, [linkData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkData) return;

    try {
      await updateLink(linkData.id, {
        customAlias: customAlias || undefined,
        expiresAt: expiresAt
          ? new Date(expiresAt).toISOString() // ✅ konversi ke ISO string
          : undefined,
      });

      Toast.success("Link updated successfully");
      onClose();
      onSuccess();
    } catch (err: any) {
      Toast.error(err.message || "Failed to update link");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-semibold">Edit Short Link</h2>

        {/* Alias */}
        <div>
          <label className="block text-sm mb-1">Alias (optional)</label>
          <input
            type="text"
            value={customAlias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="custom-customAlias"
            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2"
          />
        </div>

        {/* Expired Date */}
        <div>
          <label className="block text-sm mb-1">Expired Date (optional)</label>
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiredAt(e.target.value)}
            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 p-2"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" variant="primary">
            Update
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onClose}
            className="bg-zinc-700 hover:bg-zinc-600"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
