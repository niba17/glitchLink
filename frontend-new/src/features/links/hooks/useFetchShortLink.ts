"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { shortLinkService, ApiError } from "../services/shortLinkService";
import { ShortLink } from "../types/type";

export function useFetchShortLink() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await shortLinkService.handleGetLink();
      setLinks(data);
    } catch (err: unknown) {
      let message = "Failed to fetch links";

      if (err instanceof ApiError) {
        message = err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return { links, loading, error, refetch: fetchLinks };
}
