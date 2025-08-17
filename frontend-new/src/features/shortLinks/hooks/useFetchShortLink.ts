// frontend-new\src\features\shortLinks\hooks\useFetchShortLink.ts
import { useQuery } from "@tanstack/react-query";
import { shortLinkService } from "../services/shortLinkService";

// ✅ Gunakan useQuery dari React Query
export function useFetchShortLink() {
  const {
    data: shortLinks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["shortLinks"], // ✅ Kunci unik untuk cache query
    queryFn: shortLinkService.handleGetLink, // ✅ Fungsi yang mengambil data
  });

  return { shortLinks, isLoading, error };
}
