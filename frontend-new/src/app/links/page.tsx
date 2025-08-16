"use client";

import { useState } from "react";
import Button from "@/components/buttons/Button";
import { useRequireAuth } from "@/features/auth/hooks/useRequireAuth";
import { useFetchShortLink } from "@/features/links/hooks/useFetchShortLink";
import { Copy, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function LinksPage() {
  useRequireAuth(); // redirect otomatis jika belum login

  const { links, loading, error, refetch } = useFetchShortLink();
  const [selectedLink, setSelectedLink] = useState<null | {
    id: string;
    customAlias?: string;
    expiresAt?: string;
  }>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<null | string>(null);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard");
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    toast("Delete functionality not implemented yet");
  };

  if (loading)
    return <p className="p-[3vw] text-stone-200">Loading links...</p>;
  if (error) return <p className="p-[3vw] text-red-500">{error}</p>;

  return (
    <div className="bg-zinc-950 min-h-screen px-[15vw] py-[3vw] text-stone-200 space-y-[1vw]">
      <section>
        <div className="flex w-1/2 gap-[1vw] mb-[1vw]">
          <Button variant="primary">New Link</Button>
          <Button variant="primary">Sort by</Button>
        </div>

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
                        title="Edit short link"
                        onClick={() =>
                          setSelectedLink({
                            id: item.id,
                            customAlias: item.customAlias,
                            expiresAt: item.expiresAt,
                          })
                        }
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
                      {item.createdAt}
                    </span>
                    <span
                      title="Short link Expired"
                      className="text-[1.2vw] text-red-500"
                    >
                      {item.expiresAt || "-"}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
