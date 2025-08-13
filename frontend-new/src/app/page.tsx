"use client";

import CreateLinkForm from "@/features/links/components/forms/CreateShortLinkForm";
import ShortLinkCard from "@/features/links/components/cards/ShortLinkCard";
import {
  linkService,
  ApiError,
} from "@/features/links/services/shortLinkService";
import { ShortLink } from "@/features/links/types/type";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LandingPage() {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [shortLinkList, setShortLinkList] = useState<ShortLink[]>([]);

  // Helper aman untuk load localStorage
  const loadLocalLinks = (): ShortLink[] => {
    try {
      const data = localStorage.getItem("shortLinks");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    setShortLinkList(loadLocalLinks());
  }, []);

  const handleCreateLink = async (data: {
    originalUrl: string;
    customAlias?: string | null;
  }) => {
    setFieldErrors({});
    setLoading(true);

    try {
      const res = await linkService.createLink(data);

      if (res.status === "success") {
        toast.success("Link created successfully!", {
          description: `Your short link: ${res.data.shortUrl}`,
        });

        // Gabungkan update state & localStorage
        setShortLinkList((prev) => {
          const updated = [...prev, res.data];
          localStorage.setItem("shortLinks", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        if (error.data?.errors) {
          const newFieldErrors: { [key: string]: string } = {};
          error.data.errors.forEach(
            (err: { path: string; message: string }) => {
              newFieldErrors[err.path] = err.message;
            }
          );
          setFieldErrors(newFieldErrors);

          const messages = error.data.errors
            .map((e: { message: string }) => e.message)
            .join(", ");
          toast.error(messages);
        } else {
          toast.error(error.message);
        }
        return;
      } else if (error instanceof Error) {
        toast.error(error.message);
        return;
      } else {
        toast.error("Failed to create link");
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard!");
  };

  const handleUpdateLink = (id: string, newOriginalUrl: string) => {
    setShortLinkList((prev) => {
      const updated = prev.map((link) =>
        link.id === id ? { ...link, originalUrl: newOriginalUrl } : link
      );
      try {
        localStorage.setItem("shortLinks", JSON.stringify(updated));
      } catch {
        toast.error("Failed to update local storage");
      }
      return updated;
    });
    toast.success("Link updated locally");
  };

  const handleDeleteLink = (id: string) => {
    setShortLinkList((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("shortLinks", JSON.stringify(updated));
      return updated;
    });
    toast.success("Link deleted");
  };

  return (
    <main className="bg-zinc-950 min-h-screen px-[15vw] py-[3vw] text-stone-200">
      <section className="flex">
        <div className="flex flex-col w-[50vw] space-y-[1.85vw]">
          <p className="text-[3.7vw] leading-tight font-semibold">
            In the grid of data,
            <br /> your link is <br />a{" "}
            <span className="text-[#159976]">weapon</span>
          </p>
          <p className="text-[1.9vw]">
            Jack into real-time analytics, <br />
            forge custom-alias links, <br />
            take the control
          </p>
        </div>

        <div className="pt-[0.2vw] w-[50vw] text-[1.3vw]">
          <CreateLinkForm
            onSubmit={handleCreateLink}
            isLoading={loading}
            fieldErrors={fieldErrors}
          />
        </div>
      </section>
      {shortLinkList.length > 0 && (
        <section>
          <div className="flex items-center justify-center py-[2vw]">
            <div className="flex-grow border-t-[0.1vw]"></div>
            <h2 className="mx-[1.5vw] text-[1.3vw] font-semibold">
              Your Shortened Links
            </h2>
            <div className="flex-grow border-t-[0.1vw]"></div>
          </div>

          <ul className="grid grid-cols-3 gap-[1vw]">
            {shortLinkList.map((item) => (
              <ShortLinkCard
                key={item.id}
                id={item.id}
                shortUrl={item.shortUrl}
                originalUrl={item.originalUrl}
                onCopy={handleCopyLink}
                onUpdate={handleUpdateLink}
                onDelete={handleDeleteLink}
              />
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
