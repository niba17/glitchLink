import { useState, useEffect } from "react";
import { getDashboardLinks } from "@/lib/api";
import type { LinkItem } from "@/types/link";

export function useLinks() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = async () => {
    try {
      const res = await getDashboardLinks();

      // ⬇️ Sesuaikan sama bentuk API kamu
      if (Array.isArray(res)) {
        setLinks(res);
      } else if (res?.data && Array.isArray(res.data)) {
        setLinks(res.data);
      } else {
        setLinks([]); // kalau format aneh
      }
    } catch (err) {
      console.error("Gagal memuat links:", err);
      setError("Gagal memuat link dari server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return { links, loading, error, setLinks, fetchLinks };
}
