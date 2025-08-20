"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";
import { useClipboard } from "@/hooks/useClipboard";
import { GuestShortLinkUI } from "@/features/links/types/type";
import { GUEST_SHORT_LINK_STRINGS } from "../../constants/strings";

interface GuestShortLinkListProps {
  links: GuestShortLinkUI[];
  onDelete: (id: number) => void;
  onCopy?: (shortUrl: string) => void;
}

export function GuestShortLinkList({
  links,
  onDelete,
}: GuestShortLinkListProps) {
  const { copy } = useClipboard();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId !== null) {
      onDelete(selectedId);
    }
    setOpenDialog(false);
  };

  return (
    <>
      <ul className="grid grid-cols-3 gap-[20px]">
        {links.map((link) => (
          <li key={link.id} className="bg-zinc-800 p-[20px] rounded-sm w-full">
            <div className="flex flex-col space-y-[0.5px]">
              <a
                title="Visit short link"
                href={link.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1de2ae] underline break-all text-lg"
              >
                {link.shortUrl}
              </a>
              <span className="text-gray-400 break-all text-md">
                {link.original}
              </span>

              <div className="flex items-center justify-start gap-2 mt-2">
                <Button variant="icon" onClick={() => copy(link.shortUrl)}>
                  <Copy />
                </Button>
                <Button
                  variant="icon"
                  onClick={() => handleDeleteClick(link.id)}
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {GUEST_SHORT_LINK_STRINGS.deleteError}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {GUEST_SHORT_LINK_STRINGS.deleteConfirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-start gap-2 mt-4">
            <AlertDialogCancel onClick={() => setOpenDialog(false)}>
              {GUEST_SHORT_LINK_STRINGS.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {GUEST_SHORT_LINK_STRINGS.delete}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
