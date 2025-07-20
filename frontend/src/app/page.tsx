"use client";

import { useState } from "react";
import { shortenUrl } from "@/lib/api";

export default function LandingPage() {
  const [original, setOriginal] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [shortCode, setShortCode] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [originalError, setOriginalError] = useState<string | null>(null);
  const [aliasError, setAliasError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset semua error & hasil
    setMessage(null);
    setShortCode(null);
    setOriginalError(null);
    setAliasError(null);
    setLoading(true);

    // Validasi lokal (optional)
    if (!original.trim()) {
      setOriginalError("Original URL is required.");
      setLoading(false);
      return;
    }

    try {
      const data = await shortenUrl(original, customCode);
      setMessage(data.message || "Shortened!");
      setShortCode(data.shortCode);
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to shorten URL";

      // Coba tebak error berdasarkan isinya
      if (errorMsg.toLowerCase().includes("alias")) {
        setAliasError(errorMsg);
      } else {
        setOriginalError(errorMsg);
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
            <br /> your link is <br /> a{" "}
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
            {/* Original URL */}
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
                {
                  originalError ??
                    "\u00A0" /* non-breaking space agar tetap tinggi */
                }
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

            {/* Hasil */}
            {shortCode &&
              message &&
              (() => {
                const fullUrl = `http://localhost:4000/r/${shortCode}`;
                return (
                  <div className="mt-4 text-[1vw] space-y-1">
                    <div className="font-medium">
                      {message}
                      {": "}
                      <a
                        href={fullUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1de2ae] underline"
                      >
                        {fullUrl}
                      </a>
                    </div>
                    <div>
                      {/* <span className="text-gray-300">Short URL : </span> */}
                    </div>
                  </div>
                );
              })()}
          </form>
        </div>
      </section>
    </main>
  );
}
