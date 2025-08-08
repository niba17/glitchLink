import { useState, useEffect } from "react";
import { getDashboardLinks } from "@/lib/api";
import type { LinkItem } from "@/types/link";

export function useLinks() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const data = await getDashboardLinks();
        setLinks(data);
      } catch (err) {
        console.error("Gagal memuat links:", err);
        setError("Gagal memuat link dari server");
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  return { links, loading, error, setLinks };
}
