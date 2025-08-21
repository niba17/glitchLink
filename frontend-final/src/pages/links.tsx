// src/pages/links.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useUserLinks } from "@/features/links/hooks/useUserLinks";
import { useAuthStore } from "@/store/useAuthStore";

export default function LinksPage() {
  const { isLoggedIn, rehydrated } = useAuthStore();
  const router = useRouter();

  const { data: links, isLoading, error } = useUserLinks();

  useEffect(() => {
    if (rehydrated && !isLoggedIn) {
      router.replace("/"); // redirect guest ke landing
    }
  }, [isLoggedIn, rehydrated, router]);

  if (!rehydrated) return null; // tunggu state dihydrate sebelum render

  if (isLoading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  return (
    <div className="bg-zinc-950 min-h-screen px-[15vw] py-[3vw] text-stone-200 space-y-[1vw]">
      <section>
        <div className="grid grid-cols-5 gap-[1vw]">
          <Button variant="default">New Short Link</Button>
          <Button variant="default">Sort by</Button>
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
            {links?.map((item, idx) => (
              <tr
                key={item.id}
                className={`grid grid-cols-[5vw_30vw_15vw_1fr] py-[0.5vw] ${
                  idx % 2 === 0 ? "bg-zinc-700" : "bg-zinc-600"
                }`}
              >
                <td className="text-[1.2vw] text-center">{idx + 1}</td>

                <td>
                  <div className="flex flex-col">
                    <a
                      href={item.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[1.3vw] text-blue-500 font-semibold underline block break-words"
                    >
                      {item.shortUrl}
                    </a>
                    <span className="text-[1vw] break-all text-gray-400">
                      {item.original}
                    </span>
                  </div>
                </td>

                <td className="text-[1.2vw]">{item.clicksCount}</td>

                <td>
                  <div className="flex flex-col">
                    <span className="text-[1.2vw]">{item.createdAt}</span>
                    <span className="text-[1.2vw] text-red-500">
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
