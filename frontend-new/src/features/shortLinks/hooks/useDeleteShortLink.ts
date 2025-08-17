// frontend-new\src\features\shortLinks\hooks\useDeleteShortLink.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shortLinkService, ApiError } from "../services/shortLinkService";
import { toast } from "sonner";

export const useDeleteShortLink = () => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteLink,
    isLoading: isDeleting,
    error,
  } = useMutation({
    mutationFn: (id: string) => shortLinkService.handleDeleteLink(id),
    onSuccess: () => {
      // ✅ Invalidasi cache untuk query 'shortLinks' agar data otomatis ter-refresh
      queryClient.invalidateQueries({ queryKey: ["shortLinks"] });
      toast.success("Link berhasil dihapus!");
    },
    onError: (err: ApiError) => {
      toast.error(err.message || "Gagal menghapus link.");
    },
  });

  return { deleteLink, isDeleting, error };
};
