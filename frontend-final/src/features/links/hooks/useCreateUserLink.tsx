// frontend-final/src/features/links/hooks/useCreateUserLink.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linkService } from "../services/linkService";
import { useAuthStore } from "@/store/useAuthStore";
import { ShortLinkPayload } from "../types/type";

export function useCreateUserLink() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation({
    mutationFn: async (payload: ShortLinkPayload) => {
      if (!token) throw new Error("Unauthorized");
      const res = await linkService.createShortLink(payload, token);
      return res.data;
    },
    onSuccess: () => {
      // invalidate query userLinks agar data terbaru ditarik ulang
      queryClient.invalidateQueries({ queryKey: ["userLinks", token] });
    },
  });
}
