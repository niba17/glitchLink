// frontend-final/src/features/auth/types/auth.ts

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  name?: string; // optional kalau BE mendukung
}

export interface AuthResponse {
  status: string;
  message: string;
  token: string;
  email?: string; // optional, karena BE tidak kirim tapi kita bisa inject manual
}
