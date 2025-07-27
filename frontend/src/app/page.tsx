"use client";

import { useEffect, useState } from "react";
import { shortenUrl } from "@/lib/api";
import Toast from "@/components/ui/Toast";

type ShortLinkEntry = {
  originalUrl: string;
  customAlias: string;
  shortUrl: string; // ✅ Tambahkan ini
  createdAt: number;
};

export default function LandingPage() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [generatedAlias, setGeneratedAlias] = useState<string | null>(null); // ganti agar tidak bentrok
  const [loading, setLoading] = useState(false);
  const [originalError, setOriginalError] = useState<string | null>(null);
  const [aliasError, setAliasError] = useState<string | null>(null);
  const [history, setHistory] = useState<ShortLinkEntry[]>([]);

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

      const newEntry: ShortLinkEntry = {
        originalUrl: data.originalUrl,
        customAlias: data.customAlias,
        shortUrl: data.shortUrl, // ✅ Simpan dari response backend
        createdAt: Date.now(),
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

  return (
    <main className="bg-zinc-950 text-white px-[20vw]">
      <section className="flex gap-x-[2vw] pt-[6vw]">
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
        {history.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Your Shortened Links</h2>

            <ul className="grid grid-cols-2 gap-4">
              {history.map((item, index) => (
                <li
                  key={index}
                  className="bg-[#0f0f0f] p-4 rounded-xl shadow-sm w-full flex justify-between items-start gap-4"
                >
                  <div className="flex-1 space-y-1">
                    <div>
                      {/* <span className="text-gray-300">Short:</span>{" "} */}
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
                  </div>
                  <button
                    className="text-red-500 text-xs hover:underline"
                    onClick={() => handleDeleteLink(item.id)}
                  >
                    Delete
                  </button>
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
