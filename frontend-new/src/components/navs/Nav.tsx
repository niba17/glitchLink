"use client";

import { useState } from "react";
import Button from "@/components/buttons/Button";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import SignInModal from "@/features/auth/components/forms/SignInForm";
import SignUpModal from "@/features/auth/components/forms/SignUpForm";
import { toast } from "sonner";

export default function Nav() {
  const [modal, setModal] = useState<"signIn" | "signUp" | null>(null);
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const openSignIn = () => setModal("signIn");
  const openSignUp = () => setModal("signUp");
  const closeModal = () => setModal(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    toast.success("Logged out");
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
        <div>
          {isAuthenticated ? (
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="hover:text-red-400 text-[1.2vw]"
            >
              Sign Out
            </Button>
          ) : (
            <Button
              onClick={openSignIn}
              variant="ghost"
              className="text-stone-200 hover:text-stone-400 text-[1.3vw]"
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
    </nav>
  );
}
