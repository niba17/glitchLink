// frontend-new\src\features\shortLinks\components\forms\DeleteShortLinkForm.tsx
"use client";

import Button from "@/components/buttons/Button";
import Modal from "@/components/modals/Modal";

interface DeleteShortLinkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  children: React.ReactNode;
}

export default function DeleteShortLinkForm({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  children,
}: DeleteShortLinkFormProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete">
      <div className="flex flex-col space-y-[1vw]">
        {children}

        <Button variant="primary" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </Modal>
  );
}
