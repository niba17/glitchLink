"use client";

import { useState } from "react";
import LoginModal from "@/components/auth/loginModal";
import RegisterModal from "@/components/auth/registerModal";
import { Button } from "@/components/ui/Button";

export default function Nav() {
  const [modal, setModal] = useState<"login" | "register" | null>(null);

  const openLogin = () => setModal("login");
  const openRegister = () => setModal("register");
  const closeModal = () => setModal(null);

  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-800 text-stone-200">
      <div className="mx-auto px-[15vw] py-[0.5vw] flex items-center justify-between">
        <div className="text-[1.5vw] font-semibold">glitchLink</div>
        {/* Logo dan navigasi lainnya */}

        <Button
          onClick={openLogin}
          variant="default"
          size="none"
          className="text-stone-200 hover:text-stone-400"
        >
          Sign In
        </Button>

        <LoginModal
          isOpen={modal === "login"}
          onClose={closeModal}
          onSwitchToRegister={openRegister}
        />

        <RegisterModal
          isOpen={modal === "register"}
          onClose={closeModal}
          onSwitchToLogin={openLogin}
        />
      </div>
    </nav>
  );
}
