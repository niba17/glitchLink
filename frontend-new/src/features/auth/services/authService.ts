// src/features/auth/services/authService.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const authService = {
  async signIn(payload: { email: string; password: string }) {
    const res = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      const msg = data?.errors?.[0]?.message || data?.message || "Login failed";
      throw new ApiError(msg, res.status, data);
    }
    return data;
  },

  async signUp(payload: {
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    const res = await fetch(`${API_URL}/api/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      const msg =
        data?.errors?.[0]?.message || data?.message || "Registration failed";
      throw new ApiError(msg, res.status, data);
    }
    return data;
  },

  logout() {
    localStorage.removeItem("token"); // jika token disimpan di localStorage
  },
};
