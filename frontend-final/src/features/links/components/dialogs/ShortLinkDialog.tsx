"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateShortLinkFormContainer from "@/features/links/components/forms/CreateShortLinkFormContainer";
import UpdateShortLinkFormContainer from "@/features/links/components/forms/UpdateShortLinkFormContainer";

interface ShortLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "update";
  linkId?: number;
  currentAlias?: string;
  currentExpiresAt?: string;
  onClose?: () => void; // tambahkan ini
}

export default function ShortLinkDialog({
  open,
  onOpenChange,
  mode,
  linkId,
  currentAlias = "",
  currentExpiresAt = "",
  onClose, // ✅ tambahkan ini
}: ShortLinkDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Short Link" : "Edit Short Link"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create your short link with a custom alias or expiration date."
              : "Update your link with a custom alias or expiration date."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {mode === "create" ? (
            <CreateShortLinkFormContainer onClose={onClose} />
          ) : linkId !== undefined ? (
            <UpdateShortLinkFormContainer
              linkId={linkId}
              currentAlias={currentAlias}
              currentExpiresAt={currentExpiresAt}
              onClose={() => onOpenChange(false)}
            />
          ) : null}
        </div>
        {/* <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
