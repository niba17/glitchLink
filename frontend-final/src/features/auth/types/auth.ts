export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string; // optional kalau BE mendukung
}

export interface AuthError {
  path: string;
  message: string;
}

export interface AuthResponse {
  status: "success" | "error";
  message: string;
  token?: string; // token hanya ada kalau sukses
  email?: string; // optional
  errors?: AuthError[]; // array error dari BE
}
