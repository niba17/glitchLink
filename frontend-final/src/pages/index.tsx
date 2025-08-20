"use client";

import React, { useState, useEffect } from "react";
import CreateLinkForm from "@/features/links/components/forms/CreateShortLinkForm";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";

interface GuestLink {
  id: number;
  originalUrl: string;
  shortUrl: string;
}

export default function Home() {
  const [guestLinks, setGuestLinks] = useState<GuestLink[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("guestShortLinks");
    if (stored) {
      try {
        const parsed: (GuestLink | null)[] = JSON.parse(stored);
        // filter null agar tidak crash
        const validLinks = parsed.filter(
          (link): link is GuestLink => link !== null
        );
        setGuestLinks(validLinks);
      } catch {
        setGuestLinks([]);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 px-[145px] pt-10">
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
          <CreateLinkForm isGuest />
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

        <ul className="grid grid-cols-3 gap-[20px]">
          {guestLinks.map((link) => (
            <li
              key={link.id}
              className="bg-zinc-800 p-[20px] rounded-sm w-full"
            >
              <div className="flex flex-col space-y-[0.5px]">
                <a
                  title="Visit short link"
                  href={link.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1de2ae] underline break-all text-lg"
                >
                  {link.shortUrl}
                </a>

                <span
                  title="Original link"
                  className="text-gray-400 break-all text-md"
                >
                  {link.originalUrl}
                </span>

                <div className="flex items-center justify-start">
                  <Button
                    aria-label={`Copy ${link.shortUrl}`}
                    type="button"
                    variant="icon"
                    title="Copy short link"
                  >
                    <Copy />
                  </Button>

                  <Button
                    aria-label={`Delete ${link.shortUrl}`}
                    type="button"
                    variant="icon"
                    title="Delete short link"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
