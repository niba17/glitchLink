"use client";

import { FC } from "react";
import Modal from "@/components/modals/Modal";
import Button from "@/components/buttons/Button";

interface DeleteShortLinkFormProps {
  isOpen: boolean;
  shortUrl: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteShortLinkForm: FC<DeleteShortLinkFormProps> = ({
  isOpen,
  shortUrl,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Short Link">
      <div className="flex flex-col space-y-[1vw]">
        <p className="text-stone-300">
          Are you sure you want to delete "{shortUrl}"? This action cannot be
          undone.
        </p>

        <Button variant="primary" onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteShortLinkForm;
