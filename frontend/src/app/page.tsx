"use client";

import { useEffect, useState } from "react";
import { shortenUrl } from "@/lib/api";
import Toast from "@/components/ui/Toast";
import { Copy, Trash2 } from "lucide-react";

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ message: msg, type });
  };

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
        shortUrl: data.shortUrl, // ✅ Simpan dari response backend
        createdAt: now,
      };

      const newHistory = [newEntry, ...history];
      setHistory(newHistory);
      localStorage.setItem("guest_links", JSON.stringify(newHistory));

      showToast(data.message || "Link shortened successfully!", "success");
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to shorten link";

      if (errorMsg.toLowerCase().includes("alias")) {
        setAliasError(errorMsg);
      } else {
        setOriginalError(errorMsg);
      }

      if (err?.status && Number(err.status) >= 400) {
        showToast("Failed to shorten link", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      showToast("Short link copied!", "success");
    } catch (err) {
      showToast("Failed to copy link", "error");
    }
  };

  const handleDeleteLink = (customAlias: string) => {
    const filtered = history.filter((item) => item.customAlias !== customAlias);
    setHistory(filtered);
    localStorage.setItem("guest_links", JSON.stringify(filtered));
    showToast("Link deleted!", "success");
  };

  return (
    <main className="bg-zinc-950 text-white px-[20vw] py-[3vw]">
      <section className="flex gap-x-[2vw]">
        {/* Kiri: Headline */}
        <div className="flex flex-col w-[50vw] gap-y-[1.5vw]">
          <p className="text-[3.2vw] leading-tight font-semibold">
            In the grid of data,
            <br /> your link is <br />a{" "}
            <span className="text-[#159976]">weapon</span>
          </p>
          <p className="text-[1.5vw]">
            Jack into real-time analytics, <br />
            forge custom-alias links, <br />
            take the control
          </p>
        </div>

        {/* Kanan: Form */}
        <div className="flex flex-col w-[50vw] pt-[0.4vw]">
          <form onSubmit={handleSubmit} className="flex flex-col text-[1vw]">
            {/* Original link */}
            <div>
              <label
                htmlFor="originalUrl"
                className="block mb-[0.5vw] text-[1.3vw] font-medium"
              >
                Original Link
              </label>
              <input
                autoComplete="off"
                type="text"
                id="originalUrl"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                className={`bg-zinc-700 rounded-lg w-full p-[0.8vw] border ${
                  originalError ? "border-red-500" : "border-transparent"
                }`}
                placeholder="your original link ..."
                required
              />
              <div className="min-h-[1vw] mt-[0.3vw] block text-[0.9vw] text-red-400">
                {originalError ?? "\u00A0"}
              </div>
            </div>

            {/* Alias */}
            <div>
              <label
                htmlFor="alias"
                className="block mb-[0.5vw] text-[1.3vw] font-medium"
              >
                Alias (optional)
              </label>
              <input
                autoComplete="off"
                type="text"
                id="alias"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                className={`bg-zinc-700 rounded-lg w-full p-[0.8vw] border ${
                  aliasError ? "border-red-500" : "border-transparent"
                }`}
                placeholder="your alias ..."
              />
              <div className="min-h-[1vw] mt-[0.3vw] block text-[0.9vw] text-red-400">
                {aliasError ?? "\u00A0"}
              </div>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={loading}
              className="text-white bg-[#159976] hover:bg-[#0e7056] focus:ring-2 focus:outline-none focus:ring-[#1de2ae] font-medium rounded-lg text-[1vw] w-full py-[0.8vw] mt-[1vw] text-center"
            >
              {loading ? "Generating..." : "Get Link"}
            </button>
          </form>
        </div>
      </section>
      <section className="w-full">
        {isClient && history.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-center my-[2vw]">
              <div className="flex-grow border-t-2"></div>
              <h2 className="mx-[1.5vw] text-[1.3vw] font-semibold text-center text-white">
                Your Shortened Links
              </h2>
              <div className="flex-grow border-t-2"></div>
            </div>

            <ul className="grid grid-cols-2 gap-4">
              {history.map((item, index) => (
                <li
                  key={item.customAlias}
                  className="bg-[#0f0f0f] p-4 rounded-xl shadow-sm w-full flex justify-between items-start gap-4"
                >
                  <div className="flex flex-col space-y-1">
                    <div>
                      <a
                        href={item.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1de2ae] underline break-all"
                      >
                        {item.shortUrl}
                      </a>
                    </div>
                    <div>
                      <span className="text-gray-300">Original:</span>{" "}
                      <span className="text-white break-all">
                        {item.originalUrl}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyLink(item.shortUrl)}
                        className="p-1 text-white hover:text-[#1de2ae] transition"
                        title="Copy short URL"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteLink(item.customAlias)}
                        className="p-1 text-white hover:text-red-500 transition"
                        title="Delete link"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}
