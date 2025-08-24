"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateShortLinkFormContainer from "@/features/links/components/forms/CreateShortLinkFormContainer";
import UpdateShortLinkFormContainer from "@/features/links/components/forms/UpdateShortLinkFormContainer";

interface ShortLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "update";
  linkId?: number | null;
  currentAlias?: string;
  currentExpiresAt?: string;
}

export default function ShortLinkDialog({
  open,
  onOpenChange,
  mode,
  linkId = null,
  currentAlias = "",
  currentExpiresAt = "",
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
            <CreateShortLinkFormContainer />
          ) : (
            <UpdateShortLinkFormContainer
              linkId={linkId}
              currentAlias={currentAlias}
              currentExpiresAt={currentExpiresAt}
              onClose={() => onOpenChange(false)}
            />
          )}
        </div>

        {/* <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
