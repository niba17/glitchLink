export interface ShortLinkPayload {
  originalUrl: string;
  customAlias?: string | null;
  expiresAt?: string | null;
}

export interface ShortLinkResponse {
  status: "success";
  message: string;
  data: ShortLinkPayload & {
    id: number;
    shortCode: string;
    shortUrl: string;
    userId?: number | null;
    expiresAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface GuestLinkUI {
  id: number;
  original: string;
  shortCode: string | null;
  shortUrl: string;
  createdAt: string | null;
}

export interface GuestLink {
  id: number;
  originalUrl: string;
  shortUrl: string;
  shortCode?: string | null;
  createdAt?: string | null;
}

export interface UserLink {
  id: number;
  originalUrl: string;
  shortCode: string;
  customAlias?: string | null;
  userId: number;
  clicksCount: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  expiresAt?: string | null;
  shortUrl: string;
}
