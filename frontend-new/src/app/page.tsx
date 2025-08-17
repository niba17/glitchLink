// frontend-new\src\app\page.tsx
"use client";

import Button from "@/components/buttons/Button";
import { toast } from "sonner";
import CreateShortLinkForm from "@/features/shortLinks/components/forms/CreateShortLinkForm";
import ShortLinkCard from "@/features/shortLinks/components/cards/ShortLinkCard";
import DeleteShortLinkForm from "@/features/shortLinks/components/forms/DeleteShortLinkForm";
import { useCreateShortLink } from "@/features/shortLinks/hooks/useCreateShortLink";
import { useCopyShortLink } from "@/features/shortLinks/hooks/useCopyShortLink";
import { useShortLinkList } from "@/features/shortLinks/hooks/useShortLinkList";
import { useManageLocalShortLinks } from "@/features/shortLinks/hooks/useManageLocalShortLinks";

export default function LandingPage() {
  const { shortLinkList, isFetching, isError, refetch } = useShortLinkList();
  const { handleCopyShortLink } = useCopyShortLink();

  const {
    handleCreateShortLink,
    loading: isCreating,
    fieldErrors: createFieldErrors,
  } = useCreateShortLink(refetch);

  // 👈 Teruskan fungsi refetch ke hook delete
  const {
    isDeleteShortLinkModalOpen,
    deleteShortLinkModalContent,
    openDeleteShortLinkModal,
    closeDeleteShortLinkModal,
    handleDeleteShortLinkLocally,
  } = useManageLocalShortLinks(refetch);

  const onSubmitCreateForm = async (data: {
    originalUrl: string;
    customAlias?: string | null;
  }) => {
    return await handleCreateShortLink(data);
  };

  return (
    <main className="bg-zinc-950 min-h-screen px-[15vw] py-[3vw] text-stone-200">
      <section className="grid grid-cols-2">
        <div className="flex flex-col space-y-[1.85vw]">
          <h1 className="text-[3.75vw] leading-tight font-semibold">
            In the grid of data, <br /> your link is <br />a{" "}
            <span className="text-[#159976]">weapon</span>
          </h1>
          <p className="text-[1.5vw]">
            Jack into real-time analytics, <br />
            forge custom-alias links, <br /> take the control
          </p>
        </div>

        <div className="pt-[0.2vw]">
          <CreateShortLinkForm
            onSubmit={onSubmitCreateForm}
            isLoading={isCreating}
            fieldErrors={createFieldErrors}
          />
        </div>
      </section>

      {isFetching && <p className="text-center mt-8">Loading links...</p>}
      {isError && (
        <p className="text-center mt-8 text-red-500">Failed to load links.</p>
      )}
      {!isFetching && shortLinkList.length > 0 && (
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
                onUpdate={() => toast("Update link is pending locally.")}
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
            handleDeleteShortLinkLocally(deleteShortLinkModalContent.id)
          }
          isLoading={false}
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
