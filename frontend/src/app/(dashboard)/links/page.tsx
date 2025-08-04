import { Button } from "@/components/button/Button";
import React from "react";

const link = () => {
  return (
    <div className="bg-zinc-950 min-h-screen px-[15vw] py-[3vw] text-stone-200 space-y-[1vw]">
      <div className="flex w-1/2 gap-[1vw]">
        <Button variant="primary">Get Link</Button>
        <Button variant="primary">Newest</Button>
        <Button variant="primary">Starred</Button>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-transparent">
            <tr>
              <th className="px-[1vw] py-[1.3vw]"></th>
              <th className="px-[1vw] py-[1.3vw]">Link</th>
              <th className="px-[1vw] py-[1.3vw]">Created / Expired At</th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                original: "https://example.com/very-long-url",
                short: "glitch.link/abc123",
                created: "2025-08-04",
                expired: "2025-08-04",
              },
              {
                original: "https://another.com/path",
                short: "glitch.link/xyz789",
                created: "2025-08-03",
                expired: "2025-08-04",
              },
              {
                original: "https://nehemia.dev/",
                short: "glitch.link/nehe",
                created: "2025-08-02",
                expired: "2025-08-04",
              },
            ].map((item, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-zinc-700" : "bg-zinc-600"}
              >
                <td className="px-[1vw] py-[1.5vw]">{idx + 1}</td>
                <td className="px-[1vw] py-[1.5vw]">
                  <div className="flex flex-col">
                    <a
                      href={item.short}
                      target="_blank"
                      className="text-[1.3vw] text-blue-500 font-semibold underline"
                    >
                      {item.short}
                    </a>
                    <span className="text-[1vw]">{item.original}</span>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex flex-col">
                    <span className="text-[1.2vw] ">{item.created}</span>
                    <span className="text-[1.2vw] text-red-500">
                      {item.expired}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default link;
