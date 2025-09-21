"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { GuestLinksLoginActionDialogUI } from "../UI/GuestLinksLoginActionDialogUI";
import { useDialogStore } from "@/store/useDialogStore";
import {
  useGuestLinks,
  importGuestLinkSingle,
} from "../../../hooks/useGuestLinks";
import { useToastHandler } from "@/hooks/useToastHandler";
import { GuestLink } from "../../../types/type";

interface Selection {
  import: boolean;
  remove: boolean;
  ignore: boolean;
}

const LOCAL_STORAGE_KEY = "guestLinks"; // harus sama dengan query key useGuestLinks

export function GuestLinksLoginActionDialogContainer() {
  const router = useRouter();
  const toast = useToastHandler();
  const queryClient = useQueryClient();

  const {
    guestLinksLoginActionToken,
    openGuestLinksLoginAction,
    closeGuestLinksLoginActionDialogContainer,
  } = useDialogStore();

  const { guestLinks, deleteShortLink } = useGuestLinks();

  const [selection, setSelection] = useState<Record<number, Selection>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect otomatis jika tidak ada guest links
  useEffect(() => {
    if (openGuestLinksLoginAction && guestLinks.length === 0) {
      closeGuestLinksLoginActionDialogContainer();
      router.push("/links");
    }
  }, [
    openGuestLinksLoginAction,
    guestLinks,
    closeGuestLinksLoginActionDialogContainer,
    router,
  ]);

  // Inisialisasi checkbox
  useEffect(() => {
    if (!openGuestLinksLoginAction) {
      setSelection({});
    } else {
      const initial: Record<number, Selection> = {};
      guestLinks.forEach((link) => {
        initial[link.id] = { import: true, remove: false, ignore: false };
      });
      setSelection(initial);
    }
  }, [openGuestLinksLoginAction, guestLinks]);

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
    if (!guestLinksLoginActionToken) return;
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
        const res = await importGuestLinkSingle(
          link,
          guestLinksLoginActionToken
        );
        if (res.status === "success") {
          toast.showSuccess(res.message ?? `Imported: ${link.shortUrl}`);
          successfullyImportedIds.push(link.id);

          // ✅ Update cache React Query agar langsung muncul di /links
          queryClient.setQueryData(
            [LOCAL_STORAGE_KEY],
            (old: GuestLink[] | undefined) => {
              if (!old) return [res.link];
              const exists = old.some((l) => l.id === res.link.id);
              return exists ? old : [res.link, ...old];
            }
          );

          // ✅ Update localStorage juga agar konsisten
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          const parsed: GuestLink[] = stored ? JSON.parse(stored) : [];
          const updated = [
            res.link,
            ...parsed.filter((l) => l.id !== res.link.id),
          ];
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
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
      open={openGuestLinksLoginAction}
      guestLinks={guestLinks}
      selection={selection}
      toggle={toggle}
      onCancel={closeGuestLinksLoginActionDialogContainer}
      onConfirm={handleConfirm}
      isProcessing={isProcessing}
    />
  );
}
