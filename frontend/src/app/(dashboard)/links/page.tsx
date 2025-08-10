"use client";

import { Button } from "@/components/button/Button";
import React, { useEffect, useState } from "react";
import { Copy, Edit, Trash2, Star } from "lucide-react";
import { useLinks } from "@/hooks/useLinks";
import Toast from "@/components/toast/Toast";
import { deleteLink, getDashboardLinks } from "@/lib/api";
import EditLinkModal from "@/components/modal/links/EditLinkModal";
import ConfirmDeleteModal from "@/components/modal/ConfirmDeleteModal";

const LinkPage = () => {
  const { links, setLinks, loading, error, fetchLinks } = useLinks();
  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Handler tombol
  const handleCopy = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      Toast.success("Short link copied");
    } catch (err) {
      Toast.error("Copy short link failed");
      console.error(err);
    }
  };

  const handleStar = (id: string) => {
    console.log("Star link:", id);
    // TODO: panggil API untuk mark as starred
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLink(id);
      Toast.success("Link berhasil dihapus");
      setLinks((prev) => prev.filter((link) => link.id !== id));
    } catch (error: any) {
      Toast.error(error.message || "Gagal menghapus link");
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="bg-zinc-950 min-h-screen px-[15vw] py-[3vw] text-stone-200 space-y-[1vw]">
      {/* ✅ Modal edit */}
      <EditLinkModal
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
        linkData={selectedLink}
        onSuccess={fetchLinks}
      />

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
              <tr className="grid grid-cols-[5vw_30vw_15vw_1fr] py-[1vw]">
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
                  className={`grid grid-cols-[5vw_30vw_15vw_1fr] py-[0.5vw] ${
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
                        href={item.shortUrl}
                        target="_blank"
                        className="text-[1.3vw] text-blue-500 font-semibold underline block break-words"
                      >
                        {item.shortUrl}
                      </a>

                      <span
                        title="Original link"
                        className="text-[1vw] break-all text-gray-400"
                      >
                        {item.original}
                      </span>
                      <div className="flex mt-[0.5vw] ml-[-0.45vw]">
                        <button
                          title="Copy short link"
                          onClick={() => handleCopy(item.shortUrl)}
                          className="text-stone-200 hover:text-green-500 p-[0.5vw]"
                        >
                          <Copy style={{ width: "1.5vw", height: "1.5vw" }} />
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
                          onClick={() => {
                            setSelectedLink({
                              id: item.id,
                              customAlias: item.alias,
                              expiresAt: item.expired,
                            });
                            setEditOpen(true);
                          }}
                          className="text-stone-200 hover:text-yellow-500 p-[0.5vw]"
                        >
                          <Edit style={{ width: "1.5vw", height: "1.5vw" }} />
                        </button>

                        <button
                          title="Delete short link"
                          onClick={() => setDeleteId(item.id)}
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
      <ConfirmDeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) handleDelete(deleteId);
        }}
      />
    </div>
  );
};

export default LinkPage;
