"use client";

import { useState } from "react";
import SignInFormUI from "./SignInFormUI";
import { useSignIn } from "@/features/auth/hooks/useSignIn";
import { SignInPayload, AuthResponse } from "../../types/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { AxiosError } from "axios";

export default function SignInFormContainer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { setAuth } = useAuthStore();
  const { mutate, isPending } = useSignIn();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const payload: SignInPayload = { email, password };

    mutate(payload, {
      onSuccess: (data: AuthResponse) => {
        setAuth({
          isLoggedIn: true,
          token: data.token ?? null,
          email: payload.email,
        });
        // toast sukses sudah ditangani di hook
      },
      onError: (err: any) => {
        let msg = "User login failed";

        if (err.isAxiosError) {
          const axiosErr = err as AxiosError<any>;
          const responseData = axiosErr.response?.data;
          if (responseData) {
            // ambil pesan dari errors array dulu
            msg =
              responseData.errors?.[0]?.message || responseData.message || msg;
          }
        } else if (err instanceof Error) {
          msg = err.message;
        }

        setError(msg); // cukup tampil di dialog
        // toast error dihapus, biar tidak muncul dua kali
      },
    });
  };

  return (
    <SignInFormUI
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      onSubmit={handleSubmit}
      loading={isPending}
      error={error ?? ""}
    />
  );
}
