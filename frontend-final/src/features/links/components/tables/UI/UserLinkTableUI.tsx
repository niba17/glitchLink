// src/features/links/components/tables/UI/UserLinkTableUI.tsx
"use client";

import React from "react";
import { UserLink } from "@/features/links/types/type";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, Edit, Trash2 } from "lucide-react";
import { isAfter } from "date-fns";
import { formatForDisplay } from "@/features/links/utils/dateFormatters";

export interface UserLinkTableUIProps {
  data: UserLink[];
  onCopy: (shortUrl: string) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onVisit: (aliasOrCode: string) => void;
}

export function UserLinkTableUI({
  data,
  onCopy,
  onEdit,
  onDelete,
  onVisit,
}: UserLinkTableUIProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]"></TableHead>
          <TableHead className="text-stone-200 text-xl font-semibold">
            Links
          </TableHead>
          <TableHead className="text-end text-stone-200 text-xl font-semibold">
            Clicks
          </TableHead>
          <TableHead className="text-end text-stone-200 text-xl font-semibold">
            Created / Expired At
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-stone-400 py-6">
              No data available.
            </TableCell>
          </TableRow>
        ) : (
          data.map((link, idx) => {
            const isActive =
              !link.expiresAt || isAfter(new Date(link.expiresAt), new Date());

            return (
              <TableRow
                key={link.id}
                className="hover:bg-zinc-800 transition-colors"
              >
                {/* Index */}
                <TableCell>
                  <span className="text-xl font-semibold">{idx + 1}</span>
                </TableCell>

                {/* Link + Badge + Actions */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {/* Link */}
                    <div className="flex items-center gap-2">
                      <button
                        className="font-semibold underline text-left text-blue-400 hover:text-blue-300 break-words"
                        onClick={() =>
                          onVisit(link.customAlias || link.shortCode!)
                        }
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
                </TableCell>

                {/* Clicks */}
                <TableCell className="text-end">
                  {link.clicksCount ?? 0}{" "}
                  {link.clicksCount === 1 ? "Click" : "Clicks"}
                </TableCell>

                {/* Created / Expired */}
                <TableCell className="text-end">
                  <div className="flex flex-col text-end">
                    <span title="Short link created">
                      {formatForDisplay(link.createdAt ?? null)}
                    </span>
                    <span title="Short link expired" className="text-red-500">
                      {formatForDisplay(link.expiresAt ?? null)}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
