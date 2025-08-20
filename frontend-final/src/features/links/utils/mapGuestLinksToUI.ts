import { GuestShortLink, GuestShortLinkUI } from "@/features/links/types/type";

export function mapGuestLinksToUI(links: GuestShortLink[]): GuestShortLinkUI[] {
  return links.map((link) => ({
    id: link.id,
    original: link.originalUrl,
    shortUrl: link.shortUrl,
    shortCode: link.shortCode || "", // gunakan string kosong sebagai fallback
    createdAt: link.createdAt || new Date().toISOString(), // fallback tanggal sekarang
  }));
}
