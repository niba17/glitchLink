"use client";

import { useState } from "react";
import LoginModal from "@/components/modal/auth/signInModal";
import RegisterModal from "@/components/modal/auth/signUpModal";
import { Button } from "@/components/button/Button";

export default function Nav() {
  const [modal, setModal] = useState<"signUp" | "signIn" | null>(null);

  const openSignIn = () => setModal("signUp");
  const openSignUp = () => setModal("signIn");
  const closeModal = () => setModal(null);

  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-800 text-stone-200">
      <div className="mx-auto px-[15vw] py-[0.5vw] flex items-center justify-between">
        <div className="text-[1.5vw] font-semibold">glitchLink</div>
        {/* Logo dan navigasi lainnya */}

        <Button
          onClick={openSignIn}
          variant="default"
          size="none"
          className="text-stone-200 hover:text-stone-400 text-[1.3vw]"
        >
          Sign In
        </Button>

        <LoginModal
          isOpen={modal === "signUp"}
          onClose={closeModal}
          onSwitchToSignUp={openSignUp}
        />

        <RegisterModal
          isOpen={modal === "signIn"}
          onClose={closeModal}
          onSwitchToSignIn={openSignIn}
        />
      </div>
    </nav>
  );
}
