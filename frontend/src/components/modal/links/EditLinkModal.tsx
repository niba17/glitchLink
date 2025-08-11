"use client";

import { useEffect, useRef, useState } from "react";
import EditForm from "../../form/Edit";
import LinkInputEdit, { LinkInputRef } from "../../input/linkEditInput";
import Toast from "../../toast/Toast";
import Modal from "../Modal";

type EditLinkModalProps = {
  isOpen: boolean;
  onClose: () => void;
  linkData?: { id: string; customAlias: string; expiresDate: string };
  onSuccess: () => void;
};

export default function EditLinkModal({
  isOpen,
  onClose,
  linkData,
  onSuccess,
}: EditLinkModalProps) {
  // Refs untuk fokus ke input yang error
  const aliasRef = useRef<LinkInputRef>(null);
  const expiresRef = useRef<LinkInputRef>(null);

  // State form
  const [customAlias, setCustomAlias] = useState("");
  const [expiresDate, setExpiresDate] = useState("");
  const [aliasError, setAliasError] = useState("");
  const [expiresError, setExpiresError] = useState("");

  // Reset & set value setiap kali linkData berubah
  useEffect(() => {
    setCustomAlias(linkData?.customAlias || "");
    setExpiresDate(linkData?.expiresDate || "");
    setAliasError("");
    setExpiresError("");
  }, [linkData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    (e.nativeEvent as SubmitEvent).submitter?.blur();

    setAliasError("");
    setExpiresError("");

    // Validasi & fokus otomatis
    if (!customAlias.trim()) {
      setAliasError("Custom alias is required");
      aliasRef.current?.focus();
      return;
    }
    if (!expiresDate.trim()) {
      setExpiresError("Expiration date is required");
      expiresRef.current?.focus();
      return;
    }

    try {
      // Panggil API update link di sini
      // await updateLink(linkData.id, { customAlias, expiresDate });
      Toast.success("Link updated successfully");
      onSuccess();
      onClose();
    } catch (err: any) {
      Toast.error(err?.message || "Failed to update link");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <EditForm onSubmit={handleSubmit}>
        <LinkInputEdit
          ref={aliasRef}
          placeholder="Custom Alias"
          value={customAlias}
          onChange={(e) => setCustomAlias(e.target.value)}
          error={aliasError}
        />
        <LinkInputEdit
          ref={expiresRef}
          type="date"
          placeholder="Expiration Date"
          value={expiresDate}
          onChange={(e) => setExpiresDate(e.target.value)}
          error={expiresError}
        />
      </EditForm>
    </Modal>
  );
}
