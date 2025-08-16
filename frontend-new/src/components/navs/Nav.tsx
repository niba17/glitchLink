"use client";

import { useState } from "react";
import Button from "@/components/buttons/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import SignInModal from "@/features/auth/components/forms/SignInForm";
import SignUpModal from "@/features/auth/components/forms/SignUpForm";
import LogoutForm from "@/features/auth/components/forms/LogoutForm";

export default function Nav() {
  const [modal, setModal] = useState<"signIn" | "signUp" | null>(null);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const { isAuthenticated, isLoading } = useAuth(); // ✅ pakai API baru
  const pathname = usePathname();

  const openSignIn = () => setModal("signIn");
  const openSignUp = () => setModal("signUp");
  const closeModal = () => setModal(null);

  const openLogoutModal = () => setLogoutModalOpen(true);
  const closeLogoutModal = () => setLogoutModalOpen(false);

  const navLinks = [
    { href: "/links", label: "Links" },
    { href: "/analytics", label: "Analytics" },
    { href: "/account", label: "Account" },
    { href: "/about", label: "About" },
  ];

  if (isLoading) {
    return (
      <nav className="sticky top-0 z-50 w-full bg-zinc-800 text-stone-200 p-4">
        <div className="animate-pulse w-24 h-6 bg-zinc-700 rounded" />
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-800 text-stone-200">
      <div className="px-[15vw] py-[0.5vw] flex items-center justify-between h-[4vw]">
        {/* Logo */}
        <div className="text-[1.9vw] font-semibold">glitchLink</div>

        {/* Navigation Links */}
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
        <div className="text-[1.6vw]">
          {isAuthenticated ? (
            <Button
              aria-label="Sign out from your account"
              onClick={openLogoutModal}
              variant="ghost"
            >
              Sign Out
            </Button>
          ) : (
            <Button
              aria-label="Open sign in modal"
              onClick={openSignIn}
              variant="ghost"
              className="text-stone-200 hover:text-stone-400"
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Auth Modals */}
        <SignInModal
          isOpen={modal === "signIn"}
          onClose={closeModal}
          onSwitchToSignUp={openSignUp}
        />
        <SignUpModal
          isOpen={modal === "signUp"}
          onClose={closeModal}
          onSwitchToSignIn={openSignIn}
        />
      </div>
      <LogoutForm isOpen={logoutModalOpen} onClose={closeLogoutModal} />
    </nav>
  );
}
