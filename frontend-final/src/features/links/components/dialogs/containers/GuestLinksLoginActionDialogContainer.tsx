"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GuestLinksLoginActionDialogUI } from "../UI/GuestLinksLoginActionDialogUI";
import { useDialogStore } from "@/store/useDialogStore";
import {
  useGuestLinks,
  importGuestLinkSingle,
} from "../../../hooks/useGuestLinks";
import { useToastHandler } from "@/hooks/useToastHandler";

interface Selection {
  import: boolean;
  remove: boolean;
  ignore: boolean;
}

export function GuestLinksLoginActionDialogContainer() {
  const router = useRouter();
  const toast = useToastHandler();

  const {
    guestLinksMigrationToken,
    openGuestLinksMigration,
    closeGuestLinksLoginActionDialogContainer,
  } = useDialogStore();

  const { guestLinks, deleteShortLink } = useGuestLinks();

  const [selection, setSelection] = useState<Record<number, Selection>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect otomatis jika tidak ada guest links
  useEffect(() => {
    if (openGuestLinksMigration && guestLinks.length === 0) {
      closeGuestLinksLoginActionDialogContainer();
      router.push("/links");
    }
  }, [
    openGuestLinksMigration,
    guestLinks,
    closeGuestLinksLoginActionDialogContainer,
    router,
  ]);

  // Inisialisasi checkbox
  useEffect(() => {
    if (!openGuestLinksMigration) {
      setSelection({});
    } else {
      const initial: Record<number, Selection> = {};
      guestLinks.forEach((link) => {
        initial[link.id] = { import: true, remove: false, ignore: false };
      });
      setSelection(initial);
    }
  }, [openGuestLinksMigration, guestLinks]);

  const toggle = (id: number, type: "import" | "remove" | "ignore") => {
    setSelection((prev) => {
      if (type === "import" && !prev[id].import) {
        return {
          ...prev,
          [id]: { import: true, remove: false, ignore: false },
        };
      }
      if (type === "remove" && !prev[id].remove) {
        return {
          ...prev,
          [id]: { import: false, remove: true, ignore: false },
        };
      }
      if (type === "ignore" && !prev[id].ignore) {
        return {
          ...prev,
          [id]: { import: false, remove: false, ignore: true },
        };
      }
      return { ...prev, [id]: { ...prev[id], [type]: !prev[id][type] } };
    });
  };

  const handleConfirm = async () => {
    if (!guestLinksMigrationToken) return;
    setIsProcessing(true);

    const selectedForImport = guestLinks.filter(
      (link) => selection[link.id]?.import
    );
    const selectedForRemove = guestLinks.filter(
      (link) => selection[link.id]?.remove
    );
    const successfullyImportedIds: number[] = [];

    // IMPORT LINKS
    for (const link of selectedForImport) {
      try {
        const res = await importGuestLinkSingle(link, guestLinksMigrationToken);
        if (res.status === "success") {
          toast.showSuccess(res.message ?? `Imported: ${link.shortUrl}`);
          successfullyImportedIds.push(link.id);
        } else {
          toast.showError(res.message ?? `Failed to import: ${link.shortUrl}`);
        }
      } catch (err: any) {
        toast.showError(`Failed to import ${link.shortUrl}: ${err.message}`);
      }
    }

    // DELETE LINKS
    const idsToDelete = selectedForRemove
      .concat(
        guestLinks.filter((link) => successfullyImportedIds.includes(link.id))
      )
      .map((l) => l.id);

    for (const id of idsToDelete) {
      const deletedLink = guestLinks.find((l) => l.id === id);
      if (deletedLink) {
        await deleteShortLink(id, {
          onSuccess: () =>
            toast.showSuccess(`Deleted from local: ${deletedLink.originalUrl}`),
          onError: (err: any) =>
            toast.showError(
              err.message ?? `Failed to delete ${deletedLink.originalUrl}`
            ),
        });
      }
    }

    setIsProcessing(false);
    closeGuestLinksLoginActionDialogContainer();
    router.push("/links");
  };

  return (
    <GuestLinksLoginActionDialogUI
      open={openGuestLinksMigration}
      guestLinks={guestLinks}
      selection={selection}
      toggle={toggle}
      onCancel={closeGuestLinksLoginActionDialogContainer}
      onConfirm={handleConfirm}
      isProcessing={isProcessing}
    />
  );
}
