import { useMutation } from "@tanstack/react-query";
import { shortLinkService } from "../services/shortLinkService";
import { ShortLinkPayload, ShortLinkResponse } from "../types/type";

interface UseCreateShortLinkOptions {
  onSuccess?: (data: ShortLinkResponse) => void;
  onError?: (error: any) => void;
}

export function useCreateShortLink(options?: UseCreateShortLinkOptions) {
  return useMutation({
    mutationFn: (payload: ShortLinkPayload) =>
      shortLinkService.createShortLink(payload),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
}
