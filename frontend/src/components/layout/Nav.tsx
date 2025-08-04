"use client";

import { useState } from "react";
import LoginModal from "@/components/modal/auth/signInModal";
import RegisterModal from "@/components/modal/auth/signUpModal";
import { Button } from "@/components/button/Button";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Toast from "@/components/toast/Toast";
import { useAuth } from "@/contexts/AuthContext";

export default function Nav() {
  const [modal, setModal] = useState<"signUp" | "signIn" | null>(null);
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const openSignIn = () => setModal("signUp");
  const openSignUp = () => setModal("signIn");
  const closeModal = () => setModal(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    Toast.success("Logged out");
    router.push("/");
  };

  const navLinks = [
    { href: "/links", label: "Links" },
    { href: "/analytics", label: "Analytics" },
    { href: "/account", label: "Account" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-800 text-stone-200">
      <div className="mx-auto px-[15vw] py-[0.5vw] flex items-center justify-between">
        {/* Logo */}
        <div className="text-[1.5vw] font-semibold">glitchLink</div>

        {/* Centered Navigation */}
        {isAuthenticated && (
          <div className="flex gap-[2vw] text-[1.2vw]">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`hover:text-stone-400 transition-colors ${
                  pathname === href ? "text-[#159976]" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Auth Controls */}
        <div>
          {isAuthenticated ? (
            <Button
              onClick={handleLogout}
              variant="default"
              size="none"
              className="hover:text-red-400 text-[1.2vw]"
            >
              Sign Out
            </Button>
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
        </div>

        {/* Auth Modals */}
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
