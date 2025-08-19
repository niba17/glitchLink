import { ShortLinkPayload, ShortLinkResponse } from "../types/type";

export const shortLinkService = {
  async createShortLink(payload: ShortLinkPayload): Promise<ShortLinkResponse> {
    const res = await fetch("http://localhost:3000/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  },
};
