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
  handleCreateShortLink: async (payload: {
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

  handleGetLink: async () => {
    const res = await fetch("http://localhost:3000/api/links", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // pastikan token
      },
    });
    const data = await res.json();

    if (!res.ok) {
      throw new ApiError(data.message || "Request failed", res.status, data);
    }

    return data.data || []; // pastikan array
  },
};
