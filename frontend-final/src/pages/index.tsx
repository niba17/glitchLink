"use client";

import React from "react";
import CreateLinkForm from "@/features/links/components/forms/CreateShortLinkFormContainer";
import { useGuestShortLinks } from "@/features/links/hooks/useGuestShortLinks";
import { useClipboard } from "@/hooks/useClipboard";
import { GuestShortLinkList } from "@/features/links/components/lists/GuestShortLinkList";
import { useDeleteShortLinkToast } from "@/features/links/hooks/toast/useDeleteShortLinkToast";

export default function Home() {
  const { uiGuestLinks } = useGuestShortLinks();
  const { copy } = useClipboard();
  const deleteWithToast = useDeleteShortLinkToast();

  return (
    <main className="min-h-screen bg-zinc-950 px-[145px] py-10">
      <section className="grid grid-cols-2 gap-7">
        <div className="flex flex-col space-y-6">
          <h1 className="text-[55px] leading-[60px] font-semibold">
            In the grid of data, <br /> your link is <br />a{" "}
            <span className="text-[#159976]">weapon</span>
          </h1>
          <h2 className="text-3xl">
            Jack into real-time analytics, <br />
            forge custom-alias links, <br /> take the control
          </h2>
        </div>
        <div className="flex flex-col">
          <CreateLinkForm />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-center py-[25px]">
          <div className="flex-grow border-t-[2px]"></div>
          <h2 className="mx-[20px] text-[25px] font-semibold">
            Your Shortened Links
          </h2>
          <div className="flex-grow border-t-[2px]"></div>
        </div>

        <GuestShortLinkList
          links={uiGuestLinks}
          onDelete={deleteWithToast}
          onCopy={(shortUrl) => copy(shortUrl)}
        />
      </section>
    </main>
  );
}
