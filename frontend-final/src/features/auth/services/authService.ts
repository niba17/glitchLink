import axios from "axios";
import { SignUpPayload, SignInPayload, AuthResponse } from "../types/auth";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Cache-Control": "no-store",
    Pragma: "no-cache",
    Expires: "0",
  },
  withCredentials: true,
});

export const authService = {
  register: async (payload: SignUpPayload): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/users/register", payload, {
      headers: { "Content-Type": "application/json" },
    });

    const data = res.data;

    if (data.status !== "success") {
      const message =
        data.errors
          ?.map((e) => e.message)
          .filter(Boolean)
          .join(", ") ||
        data.message ||
        "Failed to register";
      throw new Error(message);
    }

    return data;
  },

  login: async (payload: SignInPayload): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/users/login", payload, {
      headers: { "Content-Type": "application/json" },
    });

    const data = res.data;

    if (data.status !== "success") {
      const message =
        data.errors
          ?.map((e) => e.message)
          .filter(Boolean)
          .join(", ") ||
        data.message ||
        "Failed to Sign In";
      throw new Error(message);
    }

    return data;
  },
};
