"use client";

import { useEffect } from "react";
import { create } from "zustand";

type ToastState = {
  message: string;
  type: "success" | "error";
  isOpen: boolean;
  show: (message: string, type: "success" | "error") => void;
  hide: () => void;
};

const useToastStore = create<ToastState>((set) => ({
  message: "",
  type: "success",
  isOpen: false,
  show: (message, type) => set({ message, type, isOpen: true }),
  hide: () => set({ isOpen: false }),
}));

export function ToastProvider() {
  const { message, type, isOpen, hide } = useToastStore();

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      hide();
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen, hide]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50">
      <div
        className={`px-4 py-2 rounded shadow-md text-white ${
          type === "success" ? "bg-green-500" : "bg-red-500"
        }`}
      >
        {message}
      </div>
    </div>
  );
}

// ✅ Digunakan untuk trigger
const Toast = {
  success: (msg: string) => useToastStore.getState().show(msg, "success"),
  error: (msg: string) => useToastStore.getState().show(msg, "error"),
};

export default Toast;
