import { useClipboard } from "@/hooks/useClipboard";
import { useToastHandler } from "@/hooks/useToastHandler";
import { visitShortLink } from "@/features/links/utils/visitShortLink";
import type { UserLinkDialogs } from "./useUserLinkDialogs";
import { useVisitShortLink } from "./useVisitShortLink";

interface UseUserLinkActionsProps {
  dialogs: UserLinkDialogs;
  deleteShortLink: (id: number) => void;
}

export function useUserLinkActions({
  dialogs,
  deleteShortLink,
}: UseUserLinkActionsProps) {
  const { copy } = useClipboard();
  const { showError, showSuccess } = useToastHandler();
  const { selectForEdit, selectForDelete, selectedId, setOpenDialog } = dialogs;

  const onCopy = (shortUrl: string) => copy(shortUrl);
  const onEdit = (id: number) => selectForEdit(id);
  const onDelete = (id: number) => selectForDelete(id);
  const { onVisit, loading } = useVisitShortLink();

  const handleConfirmDelete = async () => {
    if (selectedId !== null) {
      try {
        await deleteShortLink(selectedId); // <-- panggil API delete
        showSuccess("Link deleted successfully");
      } catch (err: any) {
        showError(err.message || "Failed to delete link");
      }
    }
    setOpenDialog(false);
  };

  return { onCopy, onEdit, onDelete, onVisit, handleConfirmDelete };
}
