import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";
import { GuestLinkUI } from "@/features/links/types/type";
import { GUEST_SHORT_LINK_STRINGS } from "../../../constants/strings";
import ConfirmDialog from "@/components/customs/ConfirmDialog";

interface GuestLinkListUIProps {
  links: GuestLinkUI[];
  onDeleteClick: (id: number) => void;
  onCopy: (shortUrl: string) => void;
  openDialog: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

export function GuestLinkListUI({
  links,
  onDeleteClick,
  onCopy,
  openDialog,
  onConfirmDelete,
  onCancelDelete,
}: GuestLinkListUIProps) {
  return (
    <>
      <ul className="grid grid-cols-3 gap-[20px]">
        {links.map((link) => (
          <li key={link.id} className="bg-zinc-800 p-[20px] rounded-sm w-full">
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
                {link.original}
              </span>

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
        ))}
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
