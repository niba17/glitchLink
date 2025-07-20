"use client";

import { useEffect, useState } from "react";
import { shortenUrl } from "@/lib/api";
import Toast from "@/components/ui/Toast";

type ShortLinkEntry = {
  original: string;
  shortCode: string;
  createdAt: number;
};

export default function LandingPage() {
  const [original, setOriginal] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [originalError, setOriginalError] = useState<string | null>(null);
  const [aliasError, setAliasError] = useState<string | null>(null);
  const [history, setHistory] = useState<ShortLinkEntry[]>([]);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Panggil ini saat berhasil atau gagal
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ message: msg, type });
  };

  // Load dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("guest_links");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setShortCode(null);
    setOriginalError(null);
    setAliasError(null);
    setLoading(true);

    try {
      const data = await shortenUrl(original, customCode);
      setMessage(data.message || "Shortened!");
      setShortCode(data.shortCode);

      // Simpan ke history + localStorage
      const newEntry: ShortLinkEntry = {
        original,
        shortCode: data.shortCode,
        createdAt: Date.now(),
      };
      const newHistory = [newEntry, ...history];
      setHistory(newHistory);
      localStorage.setItem("guest_links", JSON.stringify(newHistory));

      showToast(data.message || "Link shortened successfully!", "success");
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to shorten link";

      // Validasi dari backend (misal alias taken)
      if (errorMsg.toLowerCase().includes("alias")) {
        setAliasError(errorMsg);
      } else {
        setOriginalError(errorMsg);
      }

      // Hanya tampilkan toast jika error dari server (400/500)
      if (err?.status && Number(err.status) >= 400) {
        showToast("Failed to shorten link", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white px-[20vw]">
      <section className="flex h-screen gap-x-[2vw] pt-[6vw]">
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
                value={original}
                onChange={(e) => setOriginal(e.target.value)}
                className={`bg-[#222222] rounded-lg w-full p-[0.8vw] border ${
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
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                className={`bg-[#222222] rounded-lg w-full p-[0.8vw] border ${
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

          {/* Daftar link sebelumnya */}
          {history.length > 0 && (
            <div className="mt-[2vw] space-y-[1vw]">
              <h2 className="text-[1.2vw] font-semibold text-[#1de2ae]">
                Your Shortened Links:
              </h2>
              <ul className="text-[0.95vw] space-y-2">
                {history.map((item, idx) => (
                  <li key={item.createdAt} className="flex flex-col gap-1">
                    <div className="flex gap-2 items-start">
                      <span className="text-gray-400 min-w-[2ch]">
                        {idx + 1}.
                      </span>
                      <a
                        href={`http://localhost:4000/r/${item.shortCode}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1de2ae] underline break-all"
                      >
                        http://localhost:4000/r/{item.shortCode}
                      </a>
                    </div>
                    <div className="flex gap-2 items-start">
                      <span className="text-gray-400 min-w-[2ch] invisible">
                        {idx + 1}.
                      </span>
                      <span className="text-gray-300">Original:</span>
                      <span>{item.original}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
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
