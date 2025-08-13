import { useState } from "react";
import { ShortLink } from "../types/type";
import { toast } from "sonner";

export const useDeleteShortLink = (initialLinks: ShortLink[] = []) => {
  const [shortLinkList, setShortLinkList] = useState<ShortLink[]>(initialLinks);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteModalContent, setDeleteModalContent] = useState<{
    id: string;
    shortUrl: string;
  } | null>(null);

  const openDeleteModal = (id: string, shortUrl: string) => {
    setDeleteModalContent({ id, shortUrl });
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteModalContent(null);
  };

  const handleDelete = (id: string) => {
    // Gunakan filter terhadap state terbaru
    setShortLinkList((prev: ShortLink[]) => {
      const updated = prev.filter((link) => link.id !== id);
      localStorage.setItem("shortLinks", JSON.stringify(updated));
      return updated;
    });
    toast.success("Link deleted");
    closeDeleteModal();
  };

  return {
    shortLinkList,
    setShortLinkList,
    isDeleteModalOpen,
    deleteModalContent,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
  };
};
