"use client";

import React from "react";
import { UserLink } from "@/features/links/types/type";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Edit, Trash2 } from "lucide-react";
import { isAfter } from "date-fns";

interface UserLinkItemProps {
  link: UserLink;
  onCopy: (shortUrl: string) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onVisit: (aliasOrCode: string) => void;
}

export const UserLinkItem: React.FC<UserLinkItemProps> = ({
  link,
  onCopy,
  onEdit,
  onDelete,
  onVisit,
}) => {
  const isActive =
    !link.expiresAt || isAfter(new Date(link.expiresAt), new Date());

  return (
    <div className="flex flex-col gap-1">
      {/* Link + Badge */}
      <div className="flex items-center gap-2">
        <button
          className="font-semibold underline text-left text-blue-400 hover:text-blue-300 break-words"
          onClick={() => onVisit(link.customAlias || link.shortCode!)}
        >
          {link.shortUrl}
        </button>
        <Badge
          variant={isActive ? "success" : "blocked"}
          className="text-[10px] h-5 px-1 rounded-full"
        >
          {isActive ? "active" : "expired"}
        </Badge>
      </div>

      {/* Original URL */}
      <span
        title="Original link"
        className="text-[14px] text-stone-400 break-words"
      >
        {link.originalUrl}
      </span>

      {/* Action Buttons */}
      <div className="flex items-center justify-start gap-2 mt-2">
        <Button
          title="Copy short link"
          variant="icon"
          size="sm"
          onClick={() => onCopy(link.shortUrl)}
        >
          <Copy />
        </Button>
        <Button
          title="Update short link"
          variant="icon"
          size="sm"
          onClick={() => onEdit(link.id)}
        >
          <Edit />
        </Button>
        <Button
          title="Delete short link"
          variant="icon"
          size="sm"
          onClick={() => onDelete(link.id)}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
};
