// frontend-new\src\app\shortLinks\page.tsx
"use client";

import { useState } from "react";
import Button from "@/components/buttons/Button";
import { useRequireAuth } from "@/features/auth/hooks/useRequireAuth";
import { useFetchShortLink } from "@/features/shortLinks/hooks/useFetchShortLink";
import { Copy, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import DeleteShortLinkForm from "@/features/shortLinks/components/forms/DeleteShortLinkForm";
import { useDeleteShortLink } from "@/features/shortLinks/hooks/useDeleteShortLink";
import UpdateShortLinkForm from "@/features/shortLinks/components/forms/UpdateShortLinkForm";
import { useUpdateShortLink } from "@/features/shortLinks/hooks/useUpdateShortLink";
import { ShortLink } from "@/features/shortLinks/types/type";
import { ApiError } from "@/features/shortLinks/services/shortLinkService";

export default function LinksPage() {
  useRequireAuth();

  const { shortLinks, isLoading, error } = useFetchShortLink();
  const [selectedShortLink, setSelectedShortLink] = useState<ShortLink | null>(
    null
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const { deleteLink, isDeleting } = useDeleteShortLink();

  const {
    mutateAsync: updateLink,
    isLoading: isUpdating,
    error: updateError,
  } = useUpdateShortLink();

  // ✅ Logika baru untuk mengekstrak fieldErrors dari respons backend
  let fieldErrors: { [key: string]: string } = {}; // Gunakan index signature untuk kunci dinamis
  if (
    updateError instanceof ApiError &&
    updateError.data &&
    Array.isArray(updateError.data.errors) // Pastikan itu array
  ) {
    updateError.data.errors.forEach((errDetail: any) => {
      if (errDetail.path && errDetail.message) {
        fieldErrors[errDetail.path] = errDetail.message;
      }
    });
  }
  // console.log("updateError:", updateError); // Debugging
  // console.log("Extracted fieldErrors:", fieldErrors); // Debugging

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard");
  };

  const handleUpdate = async (data: {
    customAlias?: string | null;
    expiresAt?: string | null;
  }) => {
    if (!selectedShortLink) return;
    try {
      await updateLink({ id: selectedShortLink.id, payload: data });
      setIsUpdateOpen(false);
      setSelectedShortLink(null);
    } catch (err) {
      // Error handling sudah di hook useUpdateShortLink
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedShortLink) {
      await deleteLink(selectedShortLink.id);
      setIsDeleteOpen(false);
      setSelectedShortLink(null);
    }
  };

  if (isLoading)
    return <p className="p-[3vw] text-stone-200">Loading shortLinks...</p>;
  if (error) return <p className="p-[3vw] text-red-500">{String(error)}</p>;

  return (
    <div className="bg-zinc-950 min-h-screen px-[15vw] py-[3vw] text-stone-200 space-y-[1vw]">
      <section>
        <div className="grid grid-cols-5 gap-[1vw]">
          <Button variant="primary">New Short Link</Button>
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
            {shortLinks?.map((item, idx) => (
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
                      rel="noopener noreferrer"
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
                      <Button
                        aria-label={`Copy ${item.shortUrl}`}
                        type="button"
                        variant="icon"
                        onClick={() => handleCopy(item.shortUrl)}
                        title="Copy short link"
                        className="hover:bg-zinc-800"
                      >
                        <Copy className="w-[1.3vw] h-[1.3vw]" />
                      </Button>

                      <Button
                        aria-label={`Update ${item.customAlias}`}
                        type="button"
                        variant="icon"
                        onClick={() => {
                          setSelectedShortLink(item);
                          setIsUpdateOpen(true);
                        }}
                        title="Update short link"
                        className="hover:bg-zinc-800"
                      >
                        <Edit className="w-[1.3vw] h-[1.3vw]" />
                      </Button>

                      <Button
                        aria-label={`Delete ${item.shortUrl}`}
                        type="button"
                        variant="icon"
                        onClick={() => {
                          setSelectedShortLink(item);
                          setIsDeleteOpen(true);
                        }}
                        title="Delete short link"
                        className="hover:bg-zinc-800"
                      >
                        <Trash2 className="w-[1.3vw] h-[1.3vw]" />
                      </Button>
                    </div>
                  </div>
                </td>

                {/* Kolom 3 */}
                <td className="text-[1.2vw]">
                  <span title="Click counted">{item.clicksCount}</span>
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

        {/* Modal Update */}
        <UpdateShortLinkForm
          isOpen={isUpdateOpen}
          onClose={() => setIsUpdateOpen(false)}
          shortLink={selectedShortLink}
          onSubmit={handleUpdate}
          isLoading={isUpdating}
          fieldErrors={fieldErrors}
        />

        {/* Modal Delete */}
        <DeleteShortLinkForm
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
        >
          <p>
            Are you sure you want to delete{" "}
            <span className="text-blue-400 font-semibold">
              {selectedShortLink?.shortUrl}?
            </span>
          </p>
        </DeleteShortLinkForm>
      </section>
    </div>
  );
}
