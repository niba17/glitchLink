// src/features/links/components/tables/containers/UserLinkTableContainer.tsx
"use client";

import { UserLinkTableUI } from "../UI/UserLinkTableUI";
import { useUserLinks } from "@/features/links/hooks/useUserLinks";
import { useUserLinkActions } from "@/features/links/hooks/useUserLinkActions";
import { UserLinkDialogs } from "@/features/links/hooks/useUserLinkDialogs";

export function UserLinkTableContainer({
  dialogs,
}: {
  dialogs: UserLinkDialogs;
}) {
  const { data: userLinks = [], deleteShortLinkAsync } = useUserLinks();

  const { onCopy, onEdit, onDelete, onVisit } = useUserLinkActions({
    dialogs,
    deleteShortLink: deleteShortLinkAsync,
  });

  return (
    <UserLinkTableUI
      data={userLinks}
      onCopy={onCopy}
      onEdit={onEdit}
      onDelete={onDelete}
      onVisit={onVisit}
    />
  );
}
