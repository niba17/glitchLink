// frontend-final/src/features/links/components/lists/containers/GuestLinkListContainer.tsx
import { useState } from "react";
import { useClipboard } from "@/hooks/useClipboard";
import { GuestLinkUI } from "@/features/links/types/type";
import { GuestLinkListUI } from "../UI/GuestLinkListUI";
import { useGuestLinks } from "@/features/links/hooks/useGuestLinks";
import { useToastHandler } from "@/hooks/useToastHandler";
import { GUEST_SHORT_LINK_STRINGS } from "@/features/links/constants/strings";

interface GuestLinksListContainerProps {
  links: GuestLinkUI[];
}

export default function GuestLinksListContainer({
  links,
}: GuestLinksListContainerProps) {
  const { copy } = useClipboard();
  const { deleteShortLink } = useGuestLinks();
  const { showSuccess, showError } = useToastHandler();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setSelectedId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId !== null) {
      try {
        deleteShortLink(selectedId); // ✅ hapus dari localStorage + cache react-query
        showSuccess(GUEST_SHORT_LINK_STRINGS.deleteSuccess);
      } catch (err) {
        showError(GUEST_SHORT_LINK_STRINGS.deleteError);
      }
    }
    setOpenDialog(false);
    setSelectedId(null);
  };

  return (
    <GuestLinkListUI
      links={links}
      onCopy={copy}
      onDeleteClick={handleDeleteClick}
      onConfirmDelete={handleConfirmDelete}
      openDialog={openDialog}
      onCancelDelete={() => setOpenDialog(false)}
    />
  );
}
