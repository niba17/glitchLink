// src/features/auth/components/forms/SignInFormContainer.tsx
"use client";

import { useState } from "react";
import SignInFormUI from "./SignInFormUI";
import { useSignIn } from "@/features/auth/hooks/useSignIn";
import { SignInPayload } from "../../types/auth";

export default function SignInFormContainer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { mutate, isPending } = useSignIn();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const payload: SignInPayload = { email, password };

    mutate(payload, {
      onError: (err: any) => setError(err?.message || "Gagal Sign In"),
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
