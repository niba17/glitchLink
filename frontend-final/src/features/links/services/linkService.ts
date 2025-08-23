// src/features/links/services/linkService.ts
import axios from "axios";
import { ShortLinkPayload, ShortLinkResponse, UserLink } from "../types/type";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Cache-Control": "no-store", // cegah caching
    Pragma: "no-cache",
    Expires: "0",
  },
  withCredentials: true,
});

export const linkService = {
  async createShortLink(payload: ShortLinkPayload): Promise<ShortLinkResponse> {
    const res = await api.post("/links", payload, {
      headers: { "Content-Type": "application/json" },
    });

    const data = res.data;

    if (data.status !== "success") {
      const message =
        data.errors?.[0]?.message ||
        data.message ||
        "Failed to create short link";
      throw new Error(message);
    }

    return data;
  },

  async getUserLinks(token: string): Promise<UserLink[]> {
    const res = await api.get("/links", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = res.data;

    if (data.status !== "success") {
      const message =
        data.errors?.[0]?.message ||
        data.message ||
        "Failed to fetch user links";
      throw new Error(message);
    }

    return data.data;
  },

  async updateShortLink(
    id: number,
    payload: { customAlias?: string | null; expiresAt?: string | null },
    token: string
  ): Promise<{ status: string; message: string }> {
    const res = await api.put(`/links/${id}`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = res.data;

    if (data.status !== "success") {
      const message =
        data.errors?.[0]?.message || data.message || "Failed to update link";
      throw new Error(message);
    }

    return data;
  },

  async deleteUserLink(
    id: number,
    token: string
  ): Promise<{ status: string; message: string }> {
    const res = await api.delete(`/links/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = res.data;

    if (data.status !== "success") {
      const message =
        data.errors?.[0]?.message || data.message || "Failed to delete link";
      throw new Error(message);
    }

    return data;
  },
};
