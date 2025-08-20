"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import SignInFormUI from "./SignInFormUI";

export default function SignInFormContainer() {
  const { setLoggedIn } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulasi autentikasi
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (email === "test@test.com" && password === "123456") {
            resolve();
          } else {
            reject(new Error("Email atau password salah"));
          }
        }, 500);
      });

      setLoggedIn(true);
    } catch (err: any) {
      setError(err.message || "Gagal Sign In");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignInFormUI
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}
