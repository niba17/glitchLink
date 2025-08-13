export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.status = status;
    this.data = data;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const shortLinkService = {
  createShortLink: async (payload: {
    originalUrl: string;
    customAlias?: string | null;
  }) => {
    const res = await fetch("http://localhost:3000/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      // Lempar error lengkap termasuk data dari backend
      throw new ApiError(data.message || "Request failed", res.status, data);
    }

    return data;
  },
};
