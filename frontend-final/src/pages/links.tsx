"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUserLinks } from "@/features/links/hooks/useUserLinks";
import { useAuthStore } from "@/store/useAuthStore";
import { useClipboard } from "@/hooks/useClipboard";
import { Copy, Edit, Trash2 } from "lucide-react";
import { DataTable, Column } from "@/components/customs/DataTable";
import ConfirmDialog from "@/components/customs/ConfirmDialog";
import { GUEST_SHORT_LINK_STRINGS } from "@/features/links/constants/strings";
import { UserLink } from "@/features/links/types/type";
import ShortLinkDialogContainer from "@/features/links/components/dialogs/containers/ShortLinkDialogContainer";
import {
  formatForDisplay,
  formatForInput,
} from "../features/links/utils/dateFormatters"; // Import fungsi formatForInput

export default function LinksPage() {
  const { isLoggedIn, rehydrated } = useAuthStore();
  const router = useRouter();
  const { copy } = useClipboard();
  const { data: links, isLoading, error, deleteShortLink } = useUserLinks();

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
    if (selectedId !== null) deleteShortLink(selectedId);
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
            title="Visit short link"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline block break-words"
          >
            {item.shortUrl}
          </a>
          <span
            title="Original link"
            className="text-[14px] text-stone-400 break-words"
          >
            {item.originalUrl}
          </span>
          <div className="flex items-center justify-start gap-2 mt-2">
            <Button
              title="Copy short link"
              variant="icon"
              size="sm"
              onClick={() => copy(item.shortUrl)}
            >
              <Copy />
            </Button>
            <Button
              title="Update short link"
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
              title="Delete short link"
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
      render: (item) => (
        <span title="Short link clicks counted">
          {item.clicksCount ?? 0} {item.clicksCount === 1 ? "Click" : "Clicks"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: (
        <span className="text-xl font-semibold">Created / Expired At</span>
      ),
      className: "text-end text-stone-200",
      render: (item) => (
        <div className="flex flex-col text-end">
          <span title="Short link created">
            {formatForDisplay(item.createdAt ?? null)}
          </span>
          <span title="Short link expired" className="text-red-500">
            {formatForDisplay(item.expiresAt ?? null)}
          </span>
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
      <ShortLinkDialogContainer
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
        mode="create"
        onClose={() => setOpenCreateDialog(false)}
      />

      {/* 🔹 Update dialog */}
      <ShortLinkDialogContainer
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        mode="update"
        linkId={selectedId ?? undefined}
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
