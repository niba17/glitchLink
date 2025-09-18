import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUserLinks } from "@/features/links/hooks/useUserLinks";
import { useAuthStore } from "@/store/useAuthStore";
import { DataTable } from "@/components/customs/DataTable";
import ConfirmDialog from "@/components/customs/ConfirmDialog";
import { GUEST_SHORT_LINK_STRINGS } from "@/features/links/constants/strings";
import ShortLinkDialogContainer from "@/features/links/components/dialogs/containers/ShortLinkDialogContainer";
import { userLinksColumns } from "@/components/tables/UserLinksTableColumns";
import { useUserLinkDialogs } from "@/features/links/hooks/useUserLinkDialogs";
import { useUserLinkActions } from "@/features/links/hooks/useUserLinkActions";

export default function LinksPage() {
  const { isLoggedIn, rehydrated } = useAuthStore();
  const router = useRouter();
  const { data: links, isLoading, error, deleteShortLink } = useUserLinks();

  // Single state source
  const dialogs = useUserLinkDialogs();

  // Actions terhubung ke state
  const { onCopy, onEdit, onDelete, onVisit, handleConfirmDelete } =
    useUserLinkActions({ dialogs, deleteShortLink });

  useEffect(() => {
    if (rehydrated && !isLoggedIn) router.replace("/");
  }, [isLoggedIn, rehydrated, router]);

  if (!rehydrated) return null;
  if (isLoading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  const columns = userLinksColumns({ onCopy, onEdit, onDelete, onVisit });

  return (
    <section>
      <div className="bg-zinc-950 min-h-screen px-[145px] py-10 space-y-[10px]">
        <div className="grid grid-cols-5 gap-[1vw]">
          <Button onClick={() => dialogs.setOpenCreateDialog(true)}>
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

      <ShortLinkDialogContainer
        open={dialogs.openCreateDialog}
        onOpenChange={dialogs.setOpenCreateDialog}
        mode="create"
        onClose={() => dialogs.setOpenCreateDialog(false)}
      />

      <ShortLinkDialogContainer
        open={dialogs.openEditDialog}
        onOpenChange={dialogs.setOpenEditDialog}
        mode="update"
        linkId={dialogs.selectedId ?? undefined}
        currentAlias={
          links?.find((l) => l.id === dialogs.selectedId)?.customAlias || ""
        }
        currentExpiresAt={
          links?.find((l) => l.id === dialogs.selectedId)?.expiresAt || ""
        }
      />

      <ConfirmDialog
        open={dialogs.openDialog}
        title={GUEST_SHORT_LINK_STRINGS.deleteConfirmTitle}
        description={GUEST_SHORT_LINK_STRINGS.deleteConfirmDescription}
        confirmText={GUEST_SHORT_LINK_STRINGS.delete}
        cancelText={GUEST_SHORT_LINK_STRINGS.cancel}
        onConfirm={handleConfirmDelete}
        onCancel={() => dialogs.setOpenDialog(false)}
      />
    </section>
  );
}
