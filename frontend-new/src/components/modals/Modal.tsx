"use client";

import { ReactNode, useEffect, useRef } from "react";
import Button from "@/components/buttons/Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onMouseDown={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="bg-zinc-900 text-stone-200 rounded-lg shadow-lg w-[90%] max-w-md p-6 relative"
      >
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 text-stone-400 hover:text-stone-200"
          aria-label="Close"
        >
          ✕
        </Button>

        {children}
      </div>
    </div>
  );
}
