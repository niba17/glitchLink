// src/features/auth/services/authService.ts
import { SignUpPayload, SignInPayload, AuthResponse } from "../types/auth";

export const authService = {
  register: async (payload: SignUpPayload): Promise<AuthResponse> => {
    const res = await fetch("http://localhost:3000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data: AuthResponse = await res.json();

    if (data.status !== "success") {
      const message =
        data.errors?.[0]?.message || data.message || "Failed to register";
      throw new Error(message);
    }

    return data;
  },

  login: async (payload: SignInPayload): Promise<AuthResponse> => {
    const res = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data: AuthResponse = await res.json();

    if (data.status !== "success") {
      const message =
        data.errors?.[0]?.message || data.message || "Failed to Sign In";
      throw new Error(message);
    }

    return data;
  },
};
