import { useState } from "react";
import { ShortLink } from "../types/type";
import { toast } from "sonner";

export const useDeleteShortLink = (initialLinks: ShortLink[] = []) => {
  const [shortLinkList, setShortLinkList] = useState<ShortLink[]>(initialLinks);
  const [isDeleteShortLinkModalOpen, setIsDeleteShortLinkModalOpen] =
    useState(false);
  const [deleteShortLinkModalContent, setDeleteShortLinkModalContent] =
    useState<{
      id: string;
      shortUrl: string;
    } | null>(null);

  const openDeleteShortLinkModal = (id: string, shortUrl: string) => {
    setDeleteShortLinkModalContent({ id, shortUrl });
    setIsDeleteShortLinkModalOpen(true);
  };

  const closeDeleteShortLinkModal = () => {
    setIsDeleteShortLinkModalOpen(false);
    setDeleteShortLinkModalContent(null);
  };

  const handleDeleteShortLink = (id: string) => {
    // Gunakan filter terhadap state terbaru
    setShortLinkList((prev: ShortLink[]) => {
      const updated = prev.filter((link) => link.id !== id);
      localStorage.setItem("shortLinks", JSON.stringify(updated));
      return updated;
    });
    toast.success("Link deleted");
    closeDeleteShortLinkModal();
  };

  return {
    shortLinkList,
    setShortLinkList,
    isDeleteShortLinkModalOpen,
    deleteShortLinkModalContent,
    openDeleteShortLinkModal,
    closeDeleteShortLinkModal,
    handleDeleteShortLink,
  };
};
