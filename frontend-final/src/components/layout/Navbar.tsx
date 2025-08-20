// frontend-final\src\components\layout\Navbar.tsx
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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { useAuthStore } from "@/store/useAuthStore";
import AuthFormContainer from "@/features/auth/components/forms/AuthFormContainer";
import { useSignOut } from "@/features/auth/hooks/useSignOut";

export default function Navbar() {
  const { isLoggedIn } = useAuthStore();
  const { mutate: signOut } = useSignOut();

  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleConfirmLogout = () => {
    signOut();
    setOpenLogoutDialog(false);
  };

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

            <AlertDialog
              open={openLogoutDialog}
              onOpenChange={setOpenLogoutDialog}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to sign out?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex justify-end gap-2 mt-4">
                  <AlertDialogCancel onClick={() => setOpenLogoutDialog(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmLogout}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Sign Out
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </nav>
  );
}
