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
