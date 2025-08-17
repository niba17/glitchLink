// frontend-new\src\features\shortLinks\hooks\useManageLocalShortLinks.ts

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ShortLink } from "@/features/shortLinks/types/type";

export const useManageLocalShortLinks = (refetch: () => void) => {
  const [shortLinkList, setShortLinkList] = useState<ShortLink[]>([]);
  const [isDeleteShortLinkModalOpen, setIsDeleteShortLinkModalOpen] =
    useState(false);
  const [deleteShortLinkModalContent, setDeleteShortLinkModalContent] =
    useState<{
      id: string;
      shortUrl: string;
    } | null>(null);

  const openDeleteShortLinkModal = useCallback(
    (id: string, shortUrl: string) => {
      setDeleteShortLinkModalContent({ id, shortUrl });
      setIsDeleteShortLinkModalOpen(true);
    },
    []
  );

  const closeDeleteShortLinkModal = useCallback(() => {
    setIsDeleteShortLinkModalOpen(false);
    setDeleteShortLinkModalContent(null);
  }, []);

  const handleDeleteShortLinkLocally = useCallback(
    (id: string) => {
      try {
        const localLinks = JSON.parse(
          localStorage.getItem("shortLinks") || "[]"
        );
        const updatedLinks = localLinks.filter((link: any) => link.id !== id);
        localStorage.setItem("shortLinks", JSON.stringify(updatedLinks));
        toast.success("Link deleted locally!");
        closeDeleteShortLinkModal();
        refetch(); // 👈 Panggil refetch di sini
      } catch (error) {
        toast.error("Failed to delete link locally.");
      }
    },
    [closeDeleteShortLinkModal, refetch]
  );

  const handleUpdateShortLinkLocally = (
    id: string,
    newData: { customAlias?: string | null; expiresAt?: string | null }
  ) => {
    const localLinks = JSON.parse(localStorage.getItem("shortLinks") || "[]");
    const updatedLinks = localLinks.map((link: ShortLink) =>
      link.id === id
        ? {
            ...link,
            alias:
              newData.customAlias !== undefined
                ? newData.customAlias
                : link.alias,
            expiresAt:
              newData.expiresAt !== undefined
                ? newData.expiresAt
                : link.expiresAt,
          }
        : link
    );
    localStorage.setItem("shortLinks", JSON.stringify(updatedLinks));
    setShortLinkList(updatedLinks);
  };

  return {
    shortLinkList,
    setShortLinkList,
    isDeleteShortLinkModalOpen,
    deleteShortLinkModalContent,
    openDeleteShortLinkModal,
    closeDeleteShortLinkModal,
    handleDeleteShortLinkLocally,
    handleUpdateShortLinkLocally,
  };
};
