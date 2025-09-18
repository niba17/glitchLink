// frontend-final/src/features/links/components/lists/UI/GuestLinkListUI.tsx
import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";
import { GuestLinkUI } from "@/features/links/types/type";
import { GUEST_SHORT_LINK_STRINGS } from "../../../constants/strings";
import ConfirmDialog from "@/components/customs/ConfirmDialog";
import { formatForDisplay } from "@/features/links/utils/dateFormatters";
import { Badge } from "@/components/ui/badge";
import { isAfter } from "date-fns";
import { useToastHandler } from "@/hooks/useToastHandler";

interface GuestLinkListUIProps {
  links: GuestLinkUI[];
  onCopy: (shortUrl: string) => void;
  onDeleteClick: (id: number) => void;
  onConfirmDelete: () => void;
  openDialog: boolean;
  onCancelDelete: () => void;
}

export function GuestLinkListUI({
  links,
  onCopy,
  onDeleteClick,
  onConfirmDelete,
  openDialog,
  onCancelDelete,
}: GuestLinkListUIProps) {
  const { showError } = useToastHandler();

  const handleVisit = async (shortUrl: string) => {
    try {
      const res = await fetch(shortUrl, {
        method: "GET",
        redirect: "manual",
      });
      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const data = await res.json().catch(() => null);
        if (data?.status === "error") {
          showError(data.message || "Link tidak valid");
          return;
        }
      }

      if (
        res.type === "opaqueredirect" ||
        (res.status >= 300 && res.status < 400) ||
        res.status === 0
      ) {
        window.open(shortUrl, "_blank");
        return;
      }

      if (res.ok) {
        window.open(shortUrl, "_blank");
        return;
      }

      showError("Link tidak bisa diakses");
    } catch (err) {
      console.error("visit shortlink error:", err);
      showError("Something went wrong");
    }
  };

  return (
    <>
      <ul className="grid grid-cols-2 gap-[20px]">
        {links.map((link) => {
          const isActive =
            !link.expiresAt || isAfter(new Date(link.expiresAt), new Date());

          return (
            <li
              key={link.id}
              className="bg-zinc-800 p-[20px] rounded-sm w-full"
            >
              <div className="flex flex-col space-y-[0.5px]">
                <div className="flex items-center gap-2">
                  <button
                    title="Visit short link"
                    onClick={() => handleVisit(link.shortUrl)}
                    className="text-[#1de2ae] underline break-all text-lg text-left hover:opacity-80"
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

                <span
                  title="Original link"
                  className="text-gray-400 break-all text-md"
                >
                  {link.original}
                </span>

                <div className="flex space-x-1">
                  <span
                    title="Created at"
                    className="text-gray-400 break-all text-sm"
                  >
                    {formatForDisplay(link.createdAt ?? null)} {" - "}
                  </span>
                  <span
                    title="Expire at"
                    className="text-red-500 break-all text-sm"
                  >
                    {formatForDisplay(link.expiresAt ?? null)}
                  </span>
                </div>

                <div className="flex items-center justify-start gap-2 mt-2">
                  <Button
                    title="Copy short link"
                    variant="icon"
                    onClick={() => onCopy(link.shortUrl)}
                  >
                    <Copy />
                  </Button>
                  <Button
                    title="Delete short link"
                    variant="icon"
                    onClick={() => onDeleteClick(link.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <ConfirmDialog
        open={openDialog}
        title={GUEST_SHORT_LINK_STRINGS.deleteConfirmTitle}
        description={GUEST_SHORT_LINK_STRINGS.deleteConfirmDescription}
        confirmText={GUEST_SHORT_LINK_STRINGS.delete}
        cancelText={GUEST_SHORT_LINK_STRINGS.cancel}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
      />
    </>
  );
}
