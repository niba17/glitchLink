// src/features/auth/types/auth.ts
export interface SignUpPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: "success" | "error";
  message: string;
  data?: {
    userId: number;
    email: string;
    token?: string;
  };
  errors?: { message: string; field?: string }[];
}
