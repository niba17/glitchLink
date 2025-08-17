// frontend-new\src\features\shortLinks\hooks\useShortLinkList.ts
import { useState, useEffect, useCallback } from "react";
import { ShortLink } from "@/features/shortLinks/types/type";
import { shortLinkService } from "../services/shortLinkService";
import { toast } from "sonner";

export const useShortLinkList = () => {
  const [shortLinkList, setShortLinkList] = useState<ShortLink[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isError, setIsError] = useState(false);

  const refetch = useCallback(async () => {
    setIsFetching(true);
    setIsError(false);
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Ambil data dari backend jika ada token
        const res = await shortLinkService.handleGetLink();
        setShortLinkList(res.data); // Pastikan ini sesuai dengan respons backend Anda
      } else {
        // Ambil data dari local storage jika tidak ada token
        const localLinks = JSON.parse(
          localStorage.getItem("shortLinks") || "[]"
        );
        setShortLinkList(localLinks);
      }
    } catch (e) {
      setIsError(true);
      toast.error("Failed to fetch links.");
      console.error(e);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { shortLinkList, isFetching, isError, refetch };
};
