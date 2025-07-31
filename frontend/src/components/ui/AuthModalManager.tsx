"use client";

import { useState } from "react";
import LoginModal from "./loginModal";
import RegisterModal from "./registerModal";
import { Button } from "./Button";

export default function AuthModalManager() {
  const [modal, setModal] = useState<"login" | "register" | null>(null);

  const openLogin = () => setModal("login");
  const openRegister = () => setModal("register");
  const closeModal = () => setModal(null);

  return (
    <>
      <Button onClick={openLogin} size="sm" className="text-[0.8vw]">
        Sign In
      </Button>

      <LoginModal
        isOpen={modal === "login"}
        onClose={closeModal}
        onSwitchToRegister={() => setModal("register")}
      />

      <RegisterModal
        isOpen={modal === "register"}
        onClose={closeModal}
        onSwitchToLogin={() => setModal("login")}
      />
    </>
  );
}
