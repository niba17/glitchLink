import { useState } from "react";
import { useClipboard } from "@/hooks/useClipboard";
import { GuestLinkUI } from "@/features/links/types/type";
import { GuestLinkListUI } from "../UI/GuestLinkListUI";

interface GuestLinksListContainerProps {
  links: GuestLinkUI[];
  onDelete: (id: number) => void;
}

export default function GuestLinksListContainer({
  links,
  onDelete,
}: GuestLinksListContainerProps) {
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
    <GuestLinkListUI
      links={links}
      onDeleteClick={handleDeleteClick}
      onCopy={copy}
      openDialog={openDialog}
      onConfirmDelete={handleConfirmDelete}
      onCancelDelete={() => setOpenDialog(false)}
    />
  );
}
