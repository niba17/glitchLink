// frontend-new\src\features\shortLinks\components\cards\ShortLinkCard.tsx
"use client";

import { Copy, Trash2, Edit } from "lucide-react";
import Button from "@/components/buttons/Button";
import { toast } from "sonner"; // Import toast

interface ShortLinkCardProps {
  id: string;
  shortUrl: string;
  originalUrl: string;
  onCopy: (url: string) => void;
  // onUpdate sekarang hanya menerima id dan memicu pesan toast placeholder
  onUpdate: (id: string) => void;
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
    <li className="bg-zinc-800 p-[1vw] rounded-[0.5vw] w-full">
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
            aria-label={`Copy ${shortUrl}`}
            type="button"
            variant="icon"
            onClick={() => onCopy(shortUrl)}
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
            aria-label={`Delete ${shortUrl}`}
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
