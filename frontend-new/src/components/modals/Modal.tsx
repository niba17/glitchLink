"use client";

import { ReactNode, useEffect, useRef } from "react";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm text-[1.5vw]"
      onMouseDown={handleClickOutside}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="bg-zinc-900 rounded-[0.5vw] w-[30vw] p-[1.5vw] relative space-y-[1vw]"
      >
        {title && (
          <h2 className="text-center font-semibold text-[1.6vw]">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
