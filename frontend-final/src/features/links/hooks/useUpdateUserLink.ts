// frontend-final/src/features/links/hooks/useUpdateUserLink.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { linkService } from "../services/linkService";
import { useAuthStore } from "@/store/useAuthStore";

export function useUpdateUserLink() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  return useMutation({
    mutationFn: async ({
      id,
      customAlias,
      expiresAt,
    }: {
      id: number;
      customAlias?: string | null;
      expiresAt?: string | null;
    }) => {
      if (!token) throw new Error("Unauthorized");
      return linkService.updateShortLink(id, { customAlias, expiresAt }, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userLinks", token] });
    },
  });
}
