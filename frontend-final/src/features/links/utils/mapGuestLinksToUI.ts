// frontend-final/src/features/links/utils/mapGuestLinksToUI.ts
import { GuestShortLink } from "../hooks/useGuestShortLinks";

export interface GuestShortLinkUI {
  id: number;
  originalUrl: string;
  shortUrl: string;
  displayUrl: string; // misal untuk UI bisa langsung pakai format ini
}

export function mapGuestLinksToUI(links: GuestShortLink[]): GuestShortLinkUI[] {
  return links.map((link) => ({
    id: link.id,
    originalUrl: link.originalUrl,
    shortUrl: link.shortUrl,
    displayUrl: link.shortUrl || "—", // default kalau undefined/null
  }));
}
