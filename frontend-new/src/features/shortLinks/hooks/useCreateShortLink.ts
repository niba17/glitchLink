// frontend-new\src\features\shortLinks\hooks\useCreateShortLink.ts
import { useState } from "react";
import { shortLinkService, ApiError } from "../services/shortLinkService";
import { toast } from "sonner";
import { ShortLink } from "@/features/shortLinks/types/type";

export const useCreateShortLink = (refreshLinks: () => void) => {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const handleCreateShortLink = async (data: {
    originalUrl: string;
    customAlias?: string | null;
  }): Promise<boolean> => {
    setFieldErrors({});
    setLoading(true);

    const token = localStorage.getItem("token");

    // Jika pengguna sudah login (ada token), panggil API backend
    if (token) {
      try {
        const res = await shortLinkService.handleCreateShortLink(data);
        if (res.status === "success") {
          toast.success("Link created successfully!", {
            description: `Your short link: ${res.data.shortUrl}`,
          });
          refreshLinks(); // Perbarui daftar dari backend
          return true;
        }
        return false;
      } catch (error: unknown) {
        if (error instanceof ApiError) {
          if (error.status === 401 || error.status === 403) {
            toast.error("Authentication failed. Please log in again.");
          } else {
            toast.error(error.message);
          }
        }
        setLoading(false);
        return false;
      }
    } else {
      // Jika pengguna tamu (tidak ada token), simpan di local storage
      const newShortLink: ShortLink = {
        id: Math.random().toString(36).substring(7),
        shortUrl: `${window.location.origin}/${
          data.customAlias || Math.random().toString(36).substring(2, 8)
        }`,
        originalUrl: data.originalUrl,
        alias: data.customAlias,
        clicks: 0,
        createdAt: new Date().toISOString(),
        expiresAt: null,
      };

      try {
        const links = JSON.parse(localStorage.getItem("shortLinks") || "[]");
        links.unshift(newShortLink);
        localStorage.setItem("shortLinks", JSON.stringify(links));
        toast.success("Link created locally!", {
          description: `Your short link: ${newShortLink.shortUrl}`,
        });
        refreshLinks(); // Perbarui daftar dari local storage
        return true;
      } catch (e) {
        toast.error("Failed to save link locally.");
        console.error(e);
        return false;
      } finally {
        setLoading(false);
      }
    }
  };

  return { handleCreateShortLink, loading, fieldErrors };
};
