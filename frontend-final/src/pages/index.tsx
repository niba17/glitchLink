"use client";

import React, { useState, useEffect } from "react";
import CreateLinkForm from "@/features/links/components/forms/CreateShortLinkForm";
import { ShortLinkResponse } from "@/features/links/types/type";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";

export default function Home() {
  const [guestLinks, setGuestLinks] = useState<ShortLinkResponse["data"][]>([]);

  // Load guest links dari localStorage
  useEffect(() => {
    const stored = localStorage.getItem("guestShortLinks");
    if (stored) setGuestLinks(JSON.parse(stored));
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
          <CreateLinkForm isGuest /> {/* beri prop isGuest agar form tahu */}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-center py-[2vw]">
          <div className="flex-grow border-t-[0.1vw]"></div>
          <h2 className="mx-[1.5vw] text-[1.3vw] font-semibold">
            Your Shortened Links
          </h2>
          <div className="flex-grow border-t-[0.1vw]"></div>
        </div>

        <ul className="grid grid-cols-3 gap-[1vw]">
          {guestLinks.map((link) => (
            <li className="bg-zinc-800 p-[1vw] rounded-[0.5vw] w-full">
              <div className="flex flex-col space-y-[0.5vw]">
                <a
                  title="Visit short link"
                  href={link.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1de2ae] underline break-all text-[1.3vw]"
                >
                  {link.shortUrl}
                </a>

                <span
                  title="Original link"
                  className="text-gray-400 break-all text-[1.1vw]"
                >
                  {link.originalUrl}
                </span>

                <div className="flex items-center gap-x-[0.5vw] justify-start">
                  <Button
                    aria-label={`Copy ${link.shortUrl}`}
                    type="button"
                    variant="icon"
                    // onClick={() => onCopy(shortUrl)}
                    title="Copy short link"
                  >
                    <Copy className="w-[1.3vw] h-[1.3vw]" />
                  </Button>

                  {/* <Button
                      aria-label={`Update ${shortUrl}`}
                      type="button"
                      variant="icon"
                      // Mengubah onClick agar langsung memanggil onUpdate dengan id
                      onClick={() => onUpdate(id)}
                      title="Edit short link"
                    >
                      <Edit className="w-[1.3vw] h-[1.3vw]" />
                    </Button> */}

                  <Button
                    aria-label={`Delete ${link.shortUrl}`}
                    type="button"
                    variant="icon"
                    // onClick={() => onDelete(id)}
                    title="Delete short link"
                  >
                    <Trash2 className="w-[1.3vw] h-[1.3vw]" />
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
