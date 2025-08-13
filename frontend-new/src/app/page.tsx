"use client";

import CreateLinkForm from "@/features/links/components/CreateLinkForm";
import { linkService, ApiError } from "@/features/links/services/linkService";
import { Copy, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LandingPage() {
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [shortLinkList, setShortLinkList] = useState<
    Array<{
      id: string;
      shortUrl: string;
      originalUrl: string;
    }>
  >([]);

  useEffect(() => {
    const savedLinks = localStorage.getItem("shortLinks");
    if (savedLinks) {
      try {
        const parsedLinks = JSON.parse(savedLinks);
        if (Array.isArray(parsedLinks)) {
          setShortLinkList(parsedLinks);
        }
      } catch {}
    }
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

        setShortLinkList((prev) => [...prev, res.data]);

        const existingLinks = JSON.parse(
          localStorage.getItem("shortLinks") || "[]"
        );
        existingLinks.push(res.data);
        localStorage.setItem("shortLinks", JSON.stringify(existingLinks));
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
        throw error;
      } else if (error instanceof Error) {
        toast.error(error.message);
        throw error;
      } else {
        toast.error("Failed to create link");
        throw error;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard!");
  };

  const handleDeleteLink = (id: string) => {
    setShortLinkList((prev) => prev.filter((item) => item.id !== id));

    const existingLinks = JSON.parse(
      localStorage.getItem("shortLinks") || "[]"
    );
    const updatedLinks = existingLinks.filter((item: any) => item.id !== id);
    localStorage.setItem("shortLinks", JSON.stringify(updatedLinks));
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

          <ul className="grid grid-cols-3 space-x-[1vw]">
            {shortLinkList.map((item) => (
              <li
                key={item.id}
                className="bg-zinc-800 p-[1vw] rounded-[1vw] shadow-sm w-full flex justify-between items-start"
              >
                <div className="flex flex-col space-y-[0.5vw]">
                  <a
                    href={item.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1de2ae] underline break-all text-[1vw]"
                  >
                    {item.shortUrl}
                  </a>

                  <span className="text-gray-400 break-all text-[0.9vw]">
                    {item.originalUrl}
                  </span>

                  <div className="flex items-center space-x-[1vw]">
                    <button
                      onClick={() => handleCopyLink(item.shortUrl)}
                      className="hover:text-[#1de2ae] transition"
                      title="Copy short URL"
                    >
                      <Copy style={{ width: "1.1vw", height: "1.1vw" }} />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(item.id)}
                      className="hover:text-red-500 transition"
                      title="Delete link"
                    >
                      <Trash2 style={{ width: "1.1vw", height: "1.1vw" }} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
