"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUserLinks } from "@/features/links/hooks/useUserLinks";
import { useAuthStore } from "@/store/useAuthStore";
import { useClipboard } from "@/hooks/useClipboard";
import { useDeleteUserLink } from "@/features/links/hooks/useDeleteUserLink";
import { Copy, Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function LinksPage() {
  const { isLoggedIn, rehydrated } = useAuthStore();
  const router = useRouter();
  const { copied, copy } = useClipboard();
  const { data: links, isLoading, error } = useUserLinks();
  const { mutate: deleteLink } = useDeleteUserLink();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (rehydrated && !isLoggedIn) {
      router.replace("/"); // redirect guest ke landing
    }
  }, [isLoggedIn, rehydrated, router]);

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId !== null) deleteLink(selectedId);
    setOpenDialog(false);
  };

  if (!rehydrated) return null;
  if (isLoading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  return (
    <section>
      <div className="bg-zinc-950 min-h-screen px-[145px] py-10 space-y-[10px]">
        <div className="grid grid-cols-5 gap-[1vw]">
          <Button variant="default">New Short Link</Button>
          <Button variant="default">Sort by</Button>
        </div>

        <Table>
          <TableCaption>A list of your recent links.</TableCaption>
          <TableHeader className="text-lg ">
            <TableRow className="hover:bg-zinc-800">
              <TableHead className="w-[100px]"></TableHead>
              <TableHead className="font-semibold text-stone-200">
                Links
              </TableHead>
              <TableHead className="text-end font-semibold text-stone-200">
                Clicks
              </TableHead>
              <TableHead className="text-end font-semibold text-stone-200">
                Created / Expired At
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-[15px]">
            {links?.map((item, idx) => (
              <TableRow key={item.id} className="hover:bg-zinc-800">
                <TableCell className="font-medium">{idx + 1}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <a
                      href={item.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold underline block break-words"
                    >
                      {item.shortUrl}
                    </a>
                    <span className="text-[14px] text-stone-400 break-al">
                      {item.original}
                    </span>
                    <div className="flex items-center justify-start gap-2 mt-2">
                      <Button
                        variant="icon"
                        size="sm"
                        onClick={() => copy(item.shortUrl)}
                      >
                        <Copy />
                      </Button>
                      <Button
                        variant="icon"
                        size="sm"
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-end">{item.clicksCount}</TableCell>
                <TableCell className="text-end">
                  <div className="flex flex-col">
                    <span>{item.createdAt}</span>
                    <span className="text-red-500">
                      {item.expiresAt || "-"}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Link</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this short link? undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel onClick={() => setOpenDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
