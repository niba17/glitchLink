import { Column } from "@/components/customs/DataTable";
import { UserLink } from "@/features/links/types/type";
import { formatForDisplay } from "@/features/links/utils/dateFormatters";
import { UserLinkItem } from "./UserLinkItem";

interface UserLinksColumnsProps {
  onCopy: (shortUrl: string) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onVisit: (aliasOrCode: string) => void;
}

export function userLinksColumns({
  onCopy,
  onEdit,
  onDelete,
  onVisit,
}: UserLinksColumnsProps): Column<UserLink>[] {
  return [
    {
      key: "index",
      header: "",
      className: "w-[80px]",
      render: (_, idx) => (
        <span className="text-xl font-semibold">{idx + 1}</span>
      ),
    },
    {
      key: "shortUrl",
      header: <span className="text-xl font-semibold">Links</span>,
      className: "text-stone-200",
      render: (item) => (
        <UserLinkItem
          link={item}
          onCopy={onCopy}
          onEdit={onEdit}
          onDelete={onDelete}
          onVisit={onVisit}
        />
      ),
    },
    {
      key: "clicksCount",
      header: <span className="text-xl font-semibold">Clicks</span>,
      className: "text-end text-stone-200",
      render: (item) => (
        <span title="Short link clicks counted">
          {item.clicksCount ?? 0} {item.clicksCount === 1 ? "Click" : "Clicks"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: (
        <span className="text-xl font-semibold">Created / Expired At</span>
      ),
      className: "text-end text-stone-200",
      render: (item) => (
        <div className="flex flex-col text-end">
          <span title="Short link created">
            {formatForDisplay(item.createdAt ?? null)}
          </span>
          <span title="Short link expired" className="text-red-500">
            {formatForDisplay(item.expiresAt ?? null)}
          </span>
        </div>
      ),
    },
  ];
}
