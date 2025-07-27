// src/mappers/linkMapper.ts
import type { Link } from "@prisma/client";

export const mapLinkToDto = (link: Link, baseUrl: string) => ({
  id: link.id,
  originalUrl: link.original,
  shortCode: link.shortCode,
  customAlias: link.customAlias,
  shortUrl: `${baseUrl}/${link.shortCode}`,
  userId: link.userId,
  expiresAt: link.expiresAt,
  createdAt: link.createdAt,
  updatedAt: link.updatedAt,
});
