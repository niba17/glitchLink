"use client";

import { useEffect, useState } from "react";
import { shortenUrl } from "../lib/api";
import { Copy, Trash2 } from "lucide-react";
import { Button } from "../components/button/Button";
import Toast from "../components/toast/Toast";
import { mapFieldErrors } from "@/helper/mapFieldErrors";

type ShortLinkEntry = {
  id: number;
  originalUrl: string;
  customAlias: string;
  shortUrl: string;
  createdAt: string;
};

export default function LandingPage() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [generatedAlias, setGeneratedAlias] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [originalError, setOriginalError] = useState<string | null>(null);
  const [aliasError, setAliasError] = useState<string | null>(null);
  const [history, setHistory] = useState<ShortLinkEntry[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("guest_links");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setGeneratedAlias(null);
    setOriginalError(null);
    setAliasError(null);
    setLoading(true);

    try {
      const data = await shortenUrl(originalUrl, customAlias || undefined);
      setMessage(data.message || "Shortened!");
      setGeneratedAlias(data.customAlias);

      const now = new Date().toISOString();

      const newEntry: ShortLinkEntry = {
        id: data.id,
        originalUrl: data.originalUrl,
        customAlias: data.customAlias,
        shortUrl: data.shortUrl,
        createdAt: now,
      };

      const newHistory = [newEntry, ...history];
      setHistory(newHistory);
      localStorage.setItem("guest_links", JSON.stringify(newHistory));

      setOriginalUrl("");
      setCustomAlias("");
      setLoading(false);

      Toast.success(data.message || "Link shortened successfully!");
    } catch (err: any) {
      if (Array.isArray(err?.errors)) {
        err.errors.forEach((e) => {
          if (e.path === "originalUrl") setOriginalError(e.message);
          if (e.path === "customAlias") setAliasError(e.message);
        });
      }

      Toast.error(err.message || "Failed to shorten link");
      setLoading(false);
    }
  };

  const handleCopyLink = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      Toast.success("Short link copied!");
    } catch (err) {
      Toast.error("Failed to copy link");
    }
  };

  const handleDeleteLink = (id: number) => {
    const filtered = history.filter((item) => item.id !== id);
    setHistory(filtered);
    localStorage.setItem("guest_links", JSON.stringify(filtered));
    Toast.success("Link deleted!");
  };

  return (
    <main className="bg-zinc-950 min-h-screen px-[15vw] py-[3vw] text-stone-200">
      <section className="flex">
        {/* Kiri: Headline */}
        <div className="flex flex-col w-[50vw] gap-y-[1.5vw]">
          <p className="text-[3.5vw] leading-tight font-semibold">
            In the grid of data,
            <br /> your link is <br />a{" "}
            <span className="text-[#159976]">weapon</span>
          </p>
          <p className="text-[1.35vw]">
            Jack into real-time analytics, <br />
            forge custom-alias links, <br />
            take the control
          </p>
        </div>

        {/* Kanan: Form */}
        <div className="w-[50vw] pt-[0.4vw] text-[1vw]">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="space-y-[1.5vw]">
              <div className="space-y-[0.5vw]">
                {/* Original link */}
                <div className="space-y-[0.5vw]">
                  <label
                    htmlFor="originalUrl"
                    className="text-[1.3vw] font-medium"
                  >
                    Original Link
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    id="originalUrl"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    className={`bg-zinc-800 rounded-lg w-full p-[0.8vw] border ${
                      originalError ? "border-red-500" : "border-transparent"
                    }`}
                    placeholder="your original link ..."
                    required
                  />
                  <div className="min-h-[1vw] text-[0.9vw] text-red-500">
                    {originalError ?? "\u00A0"}
                  </div>
                </div>

                {/* Alias */}
                <div className="space-y-[0.5vw]">
                  <label htmlFor="alias" className="text-[1.3vw] font-medium">
                    Alias (optional)
                  </label>
                  <input
                    autoComplete="off"
                    type="text"
                    id="alias"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    className={`bg-zinc-800 rounded-lg w-full p-[0.8vw] border ${
                      aliasError ? "border-red-500" : "border-transparent"
                    }`}
                    placeholder="your alias ..."
                  />
                  <div className="min-h-[1vw] text-[0.9vw] text-red-500">
                    {aliasError ?? "\u00A0"}
                  </div>
                </div>
              </div>

              <div>
                {/* Tombol Submit */}
                <Button type="submit" disabled={loading} variant="primary">
                  Get Link
                </Button>
              </div>
            </div>
          </form>
        </div>
      </section>
      <section>
        {isClient && history.length > 0 && (
          <div className="mt-[2vw]">
            <div className="flex items-center justify-center my-[2vw]">
              <div className="flex-grow border-t-2"></div>
              <h2 className="mx-[1.5vw] text-[1.3vw] font-semibold">
                Your Shortened Links
              </h2>
              <div className="flex-grow border-t-2"></div>
            </div>

            <ul className="grid grid-cols-3 gap-[1vw]">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="bg-zinc-800 p-[1vw] rounded-xl shadow-sm w-full flex justify-between items-start"
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
          </div>
        )}
      </section>
    </main>
  );
}
