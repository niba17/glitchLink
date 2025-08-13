"use client";

import { Copy, Trash2, Edit } from "lucide-react";
import Button from "@/components/buttons/Button";

interface ShortLinkCardProps {
  id: string;
  shortUrl: string;
  originalUrl: string;
  onCopy: (url: string) => void;
  onUpdate: (id: string, newOriginalUrl: string) => void;
  onDelete: (id: string) => void;
}

export default function ShortLinkCard({
  id,
  shortUrl,
  originalUrl,
  onCopy,
  onUpdate,
  onDelete,
}: ShortLinkCardProps) {
  return (
    <li className="bg-zinc-800 p-[1vw] rounded-[1vw] shadow-sm w-full">
      <div className="flex flex-col space-y-[0.5vw]">
        <a
          title="Visit short link"
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#1de2ae] underline break-all text-[1.3vw]"
        >
          {shortUrl}
        </a>

        <span
          title="Original link"
          className="text-gray-400 break-all text-[1.1vw]"
        >
          {originalUrl}
        </span>

        <div className="flex items-center gap-x-[0.5vw] justify-start">
          <Button
            type="button"
            variant="icon"
            onClick={() => onCopy(shortUrl)}
            title="Copy short link"
          >
            <Copy className="w-[1.3vw] h-[1.3vw]" />
          </Button>

          <Button
            type="button"
            variant="icon"
            onClick={() => {
              const newUrl = prompt("Enter new original URL", originalUrl);
              if (newUrl && newUrl.trim() !== "" && newUrl !== originalUrl) {
                onUpdate(id, newUrl.trim());
              }
            }}
            title="Edit short link"
          >
            <Edit className="w-[1.3vw] h-[1.3vw]" />
          </Button>

          <Button
            type="button"
            variant="icon"
            onClick={() => onDelete(id)}
            title="Delete short link"
          >
            <Trash2 className="w-[1.3vw] h-[1.3vw]" />
          </Button>
        </div>
      </div>
    </li>
  );
}
