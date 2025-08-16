"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { shortLinkService, ApiError } from "../services/shortLinkService";
import { ShortLink } from "../types/type";

export function useFetchShortLink() {
  const [shortLinks, setShortLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await shortLinkService.handleGetLink();
      setShortLinks(data);
    } catch (err: unknown) {
      let message = "Failed to fetch shortLinks";

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

  return { shortLinks, loading, error, refetch: fetchLinks };
}
