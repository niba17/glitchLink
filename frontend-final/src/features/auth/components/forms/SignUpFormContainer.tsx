// src/features/auth/components/forms/SignUpFormContainer.tsx
"use client";

import { useState } from "react";
import SignUpFormUI from "./SignUpFormUI";
import { useSignUp } from "@/features/auth/hooks/useSignUp";
import { SignUpPayload } from "../../types/auth";

export default function SignUpFormContainer() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const mutation = useSignUp(); // gunakan object mutation

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const payload: SignUpPayload = { email, password, confirmPassword };

    mutation.mutate(payload, {
      onError: (err: any) => setError(err?.message || "Gagal Sign Up"),
    });
  };

  return (
    <SignUpFormUI
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      setEmail={setEmail}
      setPassword={setPassword}
      setConfirmPassword={setConfirmPassword}
      onSubmit={handleSubmit}
      loading={mutation.isPending} // pakai isPending untuk v5
      error={error}
    />
  );
}
