import { useGuestLinks } from "../useGuestLinks";
import { GUEST_SHORT_LINK_STRINGS } from "../../constants/strings";
import { useToastHandler } from "@/hooks/useToastHandler";

export function useDeleteShortLinkToast() {
  const { deleteShortLink } = useGuestLinks();
  const { showSuccess, showError } = useToastHandler(); // ⬅️ pakai custom toast

  const deleteWithToast = (id: number) => {
    deleteShortLink(id, {
      onSuccess: (data: any) => {
        // Ambil pesan sukses dari BE jika ada, fallback ke constant
        const message = data?.message || GUEST_SHORT_LINK_STRINGS.deleteSuccess;
        showSuccess(message);
      },
      onError: (error: any) => {
        const apiError = error.response?.data || error.data;
        const message =
          apiError?.message || GUEST_SHORT_LINK_STRINGS.deleteError;
        showError(message);
      },
    });
  };

  return deleteWithToast;
}
