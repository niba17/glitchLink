"use client";

import { useState } from "react";
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
import AuthFormContainer from "@/features/auth/components/forms/AuthFormContainer";
import ConfirmDialog from "../common/ConfirmDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function Navbar() {
  const { isLoggedIn, rehydrated } = useAuthStore();
  const { signOut } = useAuth(); // panggil di top level
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  if (!rehydrated) return null;

  const handleConfirmLogout = () => {
    signOut(); // langsung panggil hook mutate
    setOpenLogoutDialog(false);
  };

  return (
    <nav className="w-full px-[145px] py-3 flex justify-between items-center bg-zinc-800">
      <div className="text-3xl font-bold text-white">glitchLink</div>
      <div>
        {!isLoggedIn ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-[20px]">
                Sign In
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Authentication</DialogTitle>
                <DialogDescription>
                  Access your account or create a new one
                </DialogDescription>
              </DialogHeader>
              <AuthFormContainer />
            </DialogContent>
          </Dialog>
        ) : (
          <>
            <Button
              variant="ghost"
              className="text-2xl"
              onClick={() => setOpenLogoutDialog(true)}
            >
              Sign Out
            </Button>

            <ConfirmDialog
              open={openLogoutDialog}
              title="Confirm Logout"
              description="Are you sure you want to sign out?"
              confirmText="Sign Out"
              cancelText="Cancel"
              onConfirm={handleConfirmLogout}
              onCancel={() => setOpenLogoutDialog(false)}
            />
          </>
        )}
      </div>
    </nav>
  );
}
