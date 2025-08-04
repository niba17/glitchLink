"use client";

import { useEffect, useState } from "react";
import LoginModal from "@/components/modal/auth/signInModal";
import RegisterModal from "@/components/modal/auth/signUpModal";
import { Button } from "@/components/button/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Toast from "@/components/toast/Toast";
import { useAuth } from "@/contexts/AuthContext"; // ✅

export default function Nav() {
  const [modal, setModal] = useState<"signUp" | "signIn" | null>(null);
  const { isAuthenticated, setIsAuthenticated } = useAuth(); // ✅
  const router = useRouter();

  const openSignIn = () => setModal("signUp");
  const openSignUp = () => setModal("signIn");
  const closeModal = () => setModal(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    Toast.success("Logged out");
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-800 text-stone-200">
      <div className="mx-auto px-[15vw] py-[0.5vw] flex items-center justify-between">
        <div className="text-[1.5vw] font-semibold">glitchLink</div>

        {isAuthenticated ? (
          <div className="flex items-center gap-[1.5vw] text-[1.2vw]">
            <Link href="/links" className="hover:text-stone-400">
              Links
            </Link>
            <Link href="/analytics" className="hover:text-stone-400">
              Analytics
            </Link>
            <Link href="/account" className="hover:text-stone-400">
              Account
            </Link>
            <Link href="/about" className="hover:text-stone-400">
              About
            </Link>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="none"
              className="hover:text-red-400"
            >
              Sign Out
            </Button>
          </div>
        ) : (
          <Button
            onClick={openSignIn}
            variant="default"
            size="none"
            className="text-stone-200 hover:text-stone-400 text-[1.3vw]"
          >
            Sign In
          </Button>
        )}

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
