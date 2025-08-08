"use client";

import { Button } from "@/components/button/Button";
import React from "react";
import { Copy, Share2, Edit, Trash2, Star } from "lucide-react";
import { useLinks } from "@/hooks/useLinks"; // ✅ pakai hook

const LinkPage = () => {
  const { links, loading, error } = useLinks(); // ✅ data, loading, error dari hook

  // Handler tombol
  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert("Link copied!");
  };

  const handleShare = async (url: string) => {
    if (navigator.share) {
      await navigator.share({ url });
    } else {
      alert("Sharing tidak didukung di browser ini");
    }
  };

  const handleStar = (id: string) => {
    console.log("Star link:", id);
    // TODO: panggil API untuk mark as starred
  };

  const handleEdit = (id: string) => {
    console.log("Edit link:", id);
    // TODO: redirect ke halaman edit
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus link ini?")) return;
    console.log("Delete link:", id);
    // TODO: panggil API DELETE
  };

  return (
    <div className="bg-zinc-950 min-h-screen px-[15vw] py-[3vw] text-stone-200 space-y-[1vw]">
      <div className="flex w-1/2 gap-[1vw]">
        <Button variant="primary">Get Link</Button>
        <Button variant="primary">Newest</Button>
        <Button variant="primary">Starred</Button>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-transparent text-[1.5vw]">
              <tr className="grid grid-cols-[5vw_1fr_1fr_1fr] py-[1vw]">
                <th></th>
                <th>Links</th>
                <th>Clicks</th>
                <th>Created / Expired At</th>
              </tr>
            </thead>
            <tbody>
              {links.map((item, idx) => (
                <tr
                  key={item.id}
                  className={`grid grid-cols-[5vw_1fr_1fr_1fr] py-[0.5vw] ${
                    idx % 2 === 0 ? "bg-zinc-700" : "bg-zinc-600"
                  }`}
                >
                  {/* Kolom 1 */}
                  <td className="text-[1.2vw] text-center">{idx + 1}</td>

                  {/* Kolom 2 */}
                  <td>
                    <div className="flex flex-col">
                      <a
                        title="Visit short link"
                        href={item.short}
                        target="_blank"
                        className="text-[1.3vw] text-blue-500 font-semibold underline"
                      >
                        {item.short}
                      </a>
                      <span
                        title="Original link"
                        className="text-[1vw] break-all"
                      >
                        {item.original}
                      </span>
                      <div className="flex mt-[0.5vw] ml-[-0.45vw]">
                        <button
                          title="Copy short link"
                          onClick={() => handleCopy(item.short)}
                          className="text-stone-200 hover:text-blue-500 p-[0.5vw]"
                        >
                          <Copy style={{ width: "1.5vw", height: "1.5vw" }} />
                        </button>

                        <button
                          title="Share short link"
                          onClick={() => handleShare(item.short)}
                          className="text-stone-200 hover:text-green-500 p-[0.5vw]"
                        >
                          <Share2 style={{ width: "1.5vw", height: "1.5vw" }} />
                        </button>

                        <button
                          title="Star short link"
                          onClick={() => handleStar(item.id)}
                          className="text-stone-200 hover:text-orange-400 p-[0.5vw]"
                        >
                          <Star style={{ width: "1.5vw", height: "1.5vw" }} />
                        </button>

                        <button
                          title="Edit short link"
                          onClick={() => handleEdit(item.id)}
                          className="text-stone-200 hover:text-yellow-500 p-[0.5vw]"
                        >
                          <Edit style={{ width: "1.5vw", height: "1.5vw" }} />
                        </button>

                        <button
                          title="Delete short link"
                          onClick={() => handleDelete(item.id)}
                          className="text-stone-200 hover:text-red-500 p-[0.5vw]"
                        >
                          <Trash2 style={{ width: "1.5vw", height: "1.5vw" }} />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Kolom 3 */}
                  <td className="text-[1.2vw]">
                    <span title="Click counted">{item.clicks}</span>
                  </td>

                  {/* Kolom 4 */}
                  <td>
                    <div className="flex flex-col">
                      <span title="Short link created" className="text-[1.2vw]">
                        {item.created}
                      </span>
                      <span
                        title="Short link Expired"
                        className="text-[1.2vw] text-red-500"
                      >
                        {item.expired || "-"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default LinkPage;
