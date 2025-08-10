"use client";

import Modal from "@/components/modal/Modal";
import { Button } from "@/components/button/Button";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center space-y-[2vw]">
        <h2 className="text-lg font-semibold text-[2vw]">Delete confirm</h2>
        <div className="flex justify-center gap-[1.5vw]">
          <Button
            variant="danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
