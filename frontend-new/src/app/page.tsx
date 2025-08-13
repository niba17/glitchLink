"use client";

import CreateShortLinkForm from "@/features/links/components/forms/CreateShortLinkForm";
import ShortLinkCard from "@/features/links/components/cards/ShortLinkCard";
import { ShortLink } from "@/features/links/types/type";
import { useEffect } from "react";
import { toast } from "sonner";
import DeleteShortLinkForm from "@/features/links/components/forms/DeleteShortLinkForm";
import { useDeleteShortLink } from "@/features/links/hooks/useDeleteShortLink";
import { useCreateShortLink } from "@/features/links/hooks/useCreateShortLink";
import { useCopyShortLink } from "@/features/links/hooks/useCopyShortLink";

// Load local storage function (ditempatkan di luar komponen)
const loadLocalShortLinks = (): ShortLink[] => {
  try {
    const data = localStorage.getItem("shortLinks");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export default function LandingPage() {
  const {
    shortLinkList,
    setShortLinkList,
    isDeleteShortLinkModalOpen,
    deleteShortLinkModalContent,
    openDeleteShortLinkModal,
    closeDeleteShortLinkModal,
    handleDeleteShortLink,
  } = useDeleteShortLink(loadLocalShortLinks());

  const { handleCopyShortLink } = useCopyShortLink();

  const {
    handleCreateShortLink,
    loading: isCreating,
    fieldErrors,
  } = useCreateShortLink(shortLinkList, setShortLinkList);

  // Isi state shortLinkList setelah mount
  useEffect(() => {
    setShortLinkList(loadLocalShortLinks());
  }, [setShortLinkList]);

  const handleUpdateShortLink = (id: string) => {
    toast("Update link not implemented yet");
  };

  return (
    <main className="bg-zinc-950 min-h-screen px-[15vw] py-[3vw] text-stone-200">
      <section className="grid grid-cols-2">
        <div className="flex flex-col space-y-[1.85vw]">
          <p className="text-[3.75vw] leading-tight font-semibold">
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

        <div className="pt-[0.2vw]">
          <CreateShortLinkForm
            onSubmit={handleCreateShortLink}
            isLoading={isCreating}
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

          <ul className="grid grid-cols-3 gap-[1vw]">
            {shortLinkList.map((item) => (
              <ShortLinkCard
                key={item.id}
                id={item.id}
                shortUrl={item.shortUrl}
                originalUrl={item.originalUrl}
                onCopy={() => handleCopyShortLink(item.shortUrl)}
                onUpdate={() => handleUpdateShortLink(item.id)}
                onDelete={() =>
                  openDeleteShortLinkModal(item.id, item.shortUrl)
                }
              />
            ))}
          </ul>
        </section>
      )}

      {deleteShortLinkModalContent && (
        <DeleteShortLinkForm
          isOpen={isDeleteShortLinkModalOpen}
          onClose={closeDeleteShortLinkModal}
          onConfirm={() =>
            handleDeleteShortLink(deleteShortLinkModalContent.id)
          }
        >
          <p className="text-[1.2vw]">
            Sure to delete{" "}
            <span className="text-[#159976] break-all">
              {deleteShortLinkModalContent.shortUrl}
            </span>{" "}
            ?
          </p>
        </DeleteShortLinkForm>
      )}
    </main>
  );
}
