// src/components/layout/Navbar.tsx
"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { useAuthStore } from "@/store/useAuthStore";
import SignInFormContainer from "@/features/auth/components/forms/SignInFormContainer";

export default function Navbar() {
  const { isLoggedIn, setLoggedIn } = useAuthStore();

  const handleSignOut = () => setLoggedIn(false);

  return (
    <nav className="w-full px-[145px] py-3 flex justify-between items-center bg-zinc-800">
      <div className="text-3xl font-bold text-white">glitchLink</div>
      <div>
        {!isLoggedIn ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-2xl">
                Sign In
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sign In</DialogTitle>
                <DialogDescription>
                  Masukkan email dan password Anda
                </DialogDescription>
              </DialogHeader>
              <SignInFormContainer />
            </DialogContent>
          </Dialog>
        ) : (
          <Button variant="ghost" className="text-2xl" onClick={handleSignOut}>
            Sign Out
          </Button>
        )}
      </div>
    </nav>
  );
}
