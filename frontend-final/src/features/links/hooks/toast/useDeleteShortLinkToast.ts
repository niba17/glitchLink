"use client";

import { toast } from "sonner";
import { useGuestLinks } from "../useGuestLinks";
import { GUEST_SHORT_LINK_STRINGS } from "../../constants/strings";

/**
 * Hook helper untuk delete guest link dengan toast.
 * Kelebihan: reusable dan konsisten di seluruh app.
 */
export function useDeleteShortLinkToast() {
  const { deleteShortLink } = useGuestLinks();

  const deleteWithToast = (id: number) => {
    deleteShortLink(id, {
      onSuccess: () => toast.success(GUEST_SHORT_LINK_STRINGS.deleteSuccess),
      onError: (err: any) =>
        toast.error(err?.message || GUEST_SHORT_LINK_STRINGS.deleteError),
    });
  };

  return deleteWithToast;
}
