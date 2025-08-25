"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUserLinks } from "@/features/links/hooks/useUserLinks";
import { useAuthStore } from "@/store/useAuthStore";
import { useClipboard } from "@/hooks/useClipboard";
import { useDeleteUserLink } from "@/features/links/hooks/useDeleteUserLink";
import { Copy, Edit, Trash2 } from "lucide-react";
import { DataTable, Column } from "@/components/common/DataTable";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { GUEST_SHORT_LINK_STRINGS } from "@/features/links/constants/strings";
import { UserLink } from "@/features/links/types/type";
import ShortLinkDialog from "@/features/links/components/dialogs/ShortLinkDialog";

export default function LinksPage() {
  const { isLoggedIn, rehydrated } = useAuthStore();
  const router = useRouter();
  const { copy } = useClipboard();
  const { data: links, isLoading, error } = useUserLinks();
  const { mutate: deleteLink } = useDeleteUserLink();

  // state dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (rehydrated && !isLoggedIn) {
      router.replace("/");
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

  const columns: Column<UserLink>[] = [
    {
      key: "index",
      header: "",
      render: (_, idx) => (
        <span className="text-xl font-semibold">{idx + 1}</span>
      ),
      className: "w-[80px]",
    },
    {
      key: "shortUrl",
      header: <span className="text-xl font-semibold">Links</span>,
      className: "text-stone-200",
      render: (item) => (
        <div className="flex flex-col">
          <a
            href={item.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline block break-words"
          >
            {item.shortUrl}
          </a>
          <span className="text-[14px] text-stone-400 break-words">
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
              onClick={() => {
                setSelectedId(item.id);
                setOpenEditDialog(true);
              }}
            >
              <Edit />
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
      ),
    },
    {
      key: "clicksCount",
      header: <span className="text-xl font-semibold">Clicks</span>,
      className: "text-end text-stone-200",
    },
    {
      key: "createdAt",
      header: (
        <span className="text-xl font-semibold">Created / Expired At</span>
      ),
      className: "text-end text-stone-200",
      render: (item) => (
        <div className="flex flex-col text-end">
          <span>{item.createdAt}</span>
          <span className="text-red-500">{item.expiresAt || "-"}</span>
        </div>
      ),
    },
  ];

  return (
    <section>
      <div className="bg-zinc-950 min-h-screen px-[145px] py-10 space-y-[10px]">
        <div className="grid grid-cols-5 gap-[1vw]">
          <Button onClick={() => setOpenCreateDialog(true)}>
            Create Short Link
          </Button>
          <Button variant="default">Sort by</Button>
        </div>

        <DataTable
          data={links || []}
          columns={columns}
          className="text-[15px]"
        />
      </div>

      {/* 🔹 Create dialog */}
      <ShortLinkDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        mode="create"
        onClose={() => setOpenCreateDialog(false)}
      />

      {/* 🔹 Update dialog */}
      <ShortLinkDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        mode="update"
        linkId={selectedId ?? undefined} // ✅ null di-convert ke undefined
        currentAlias={
          links?.find((l) => l.id === selectedId)?.customAlias || ""
        }
        currentExpiresAt={
          links?.find((l) => l.id === selectedId)?.expiresAt || ""
        }
      />

      {/* 🔹 Confirm delete */}
      <ConfirmDialog
        open={openDialog}
        title={GUEST_SHORT_LINK_STRINGS.deleteConfirmTitle}
        description={GUEST_SHORT_LINK_STRINGS.deleteConfirmDescription}
        confirmText={GUEST_SHORT_LINK_STRINGS.delete}
        cancelText={GUEST_SHORT_LINK_STRINGS.cancel}
        onConfirm={handleConfirmDelete}
        onCancel={() => setOpenDialog(false)}
      />
    </section>
  );
}
