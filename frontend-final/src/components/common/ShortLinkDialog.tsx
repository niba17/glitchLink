"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateUserLink } from "@/features/links/hooks/useUpdateUserLink";
import { DateTimeInput } from "../ui/DateTimeInput";
import { toast } from "sonner";

interface ShortLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  linkId: number | null;
  currentAlias?: string;
  currentExpiresAt?: string;
}

export default function ShortLinkDialog({
  open,
  onOpenChange,
  linkId,
  currentAlias = "",
  currentExpiresAt = "",
}: ShortLinkDialogProps) {
  const [customAlias, setCustomAlias] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { mutate: updateLink, isPending } = useUpdateUserLink();

  // isi input saat dialog dibuka atau linkId berubah
  useEffect(() => {
    if (open) {
      setCustomAlias(currentAlias);
      setExpiresAt(currentExpiresAt);
      setErrorMsg(null); // reset error
    }
  }, [open, linkId, currentAlias, currentExpiresAt]);

  const handleSave = () => {
    if (!linkId) return;

    let formattedExpiresAt: string | null = null;
    if (expiresAt) {
      formattedExpiresAt = new Date(expiresAt).toISOString();
    }

    setErrorMsg(null);

    updateLink(
      { id: linkId, customAlias, expiresAt: formattedExpiresAt },
      {
        onSuccess: (res: any) => {
          const successMsg = res?.message || "Link updated successfully";
          toast.success(successMsg);
          onOpenChange(false);
        },
        onError: (err: any) => {
          let message = "Something went wrong";

          if (err?.response?.data?.errors?.length) {
            message = err.response.data.errors[0].message;
          } else if (err?.response?.data?.message) {
            message = err.response.data.message;
          }

          setErrorMsg(message);
          toast.error(message);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Short Link</DialogTitle>
          <DialogDescription>
            Update your link with a custom alias or expiration date.
          </DialogDescription>
          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Custom alias (optional)"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
          />
          <DateTimeInput
            type="datetime-local"
            placeholder="Expiration date (optional)"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
