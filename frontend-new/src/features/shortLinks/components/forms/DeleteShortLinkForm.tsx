"use client";

import Button from "@/components/buttons/Button";
import Modal from "@/components/modals/Modal";

interface DeleteShortLinkFormProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
}

export default function DeleteShortLinkForm({
  isOpen,
  onClose,
  onConfirm,
  children,
}: DeleteShortLinkFormProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete">
      <div className="flex flex-col space-y-[1vw]">
        {children}

        <Button variant="primary" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
