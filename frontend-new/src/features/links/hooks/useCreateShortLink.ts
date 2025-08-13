// hooks/useCreateShortLink.ts
import { useState } from "react";
import { ShortLink } from "../types/type";
import { shortLinkService, ApiError } from "../services/shortLinkService";
import { toast } from "sonner";

export const useCreateShortLink = (
  shortLinkList: ShortLink[],
  setShortLinkList: (links: ShortLink[]) => void
) => {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const createShortLink = async (data: {
    originalUrl: string;
    customAlias?: string | null;
  }) => {
    setFieldErrors({});
    setLoading(true);

    try {
      const res = await shortLinkService.createShortLink(data);

      if (res.status === "success") {
        const updatedList = [...shortLinkList, res.data];
        setShortLinkList(updatedList);
        localStorage.setItem("shortLinks", JSON.stringify(updatedList));

        toast.success("Link created successfully!", {
          description: `Your short link: ${res.data.shortUrl}`,
        });
      }
    } catch (error: unknown) {
      if (error instanceof ApiError && error.data?.errors) {
        const newFieldErrors: { [key: string]: string } = {};
        error.data.errors.forEach((err: { path: string; message: string }) => {
          newFieldErrors[err.path] = err.message;
        });
        setFieldErrors(newFieldErrors);

        const messages = error.data.errors
          .map((e: { message: string }) => e.message)
          .join(", ");
        toast.error(messages);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create link");
      }
    } finally {
      setLoading(false);
    }
  };

  return { createShortLink, loading, fieldErrors };
};
