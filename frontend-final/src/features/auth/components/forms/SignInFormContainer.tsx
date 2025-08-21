"use client";

import { useState } from "react";
import SignInFormUI from "./SignInFormUI";
import { useSignIn } from "@/features/auth/hooks/useSignIn";
import { SignInPayload, AuthResponse } from "../../types/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export default function SignInFormContainer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { setAuth } = useAuthStore(); // ✅ pakai setAuth
  const { mutate, isPending } = useSignIn();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const payload: SignInPayload = { email, password };

    mutate(payload, {
      onSuccess: (data: AuthResponse) => {
        setAuth({
          isLoggedIn: true,
          token: data.token,
          email: payload.email,
        });
        toast.success(data.message || "User login successfully");
      },

      onError: (err: any) => setError(err?.message || "User login failed"),
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
      error={error}
    />
  );
}
