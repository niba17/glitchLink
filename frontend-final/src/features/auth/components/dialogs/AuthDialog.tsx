"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AuthFormContainer from "@/features/auth/components/containers/AuthFormContainer";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Authentication</DialogTitle>
          <DialogDescription>
            Access your account or create a new one
          </DialogDescription>
        </DialogHeader>
        <AuthFormContainer onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
