"use client";

import { useState } from "react";
import SignInFormUI from "./SignInFormUI";
import { useSignIn } from "@/features/auth/hooks/useSignIn";
import { useAuthStore } from "@/store/useAuthStore";
import { SignInPayload, AuthResponse } from "../../types/auth";
import { AxiosError } from "axios";

interface Props {
  onClose?: () => void;
}

export default function SignInFormContainer({ onClose }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [rootError, setRootError] = useState<string | null>(null);

  const { setAuth } = useAuthStore();
  const { mutate, isPending } = useSignIn();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setRootError(null);

    const payload: SignInPayload = { email, password };

    mutate(payload, {
      onSuccess: (data: AuthResponse) => {
        setAuth({
          isLoggedIn: true,
          token: data.token ?? null,
          email: payload.email,
        });
        if (onClose) onClose(); // menutup dialog
      },
      onError: (err: any) => {
        let fe: Record<string, string> = {};
        let re: string | null = "User login failed";

        if (err.isAxiosError) {
          const axiosErr = err as AxiosError<any>;
          const data = axiosErr.response?.data;
          if (data) {
            if (Array.isArray(data.errors) && data.errors.length) {
              data.errors.forEach((e: { path: string; message: string }) => {
                // tetapkan field error walaupun message kosong
                fe[e.path] = e.message || "";
              });
              // ambil root message dari backend
              re = data.message || re;
            } else if (data.message) {
              re = data.message;
            }
          }
        } else if (err instanceof Error) {
          re = err.message;
        }

        setFieldErrors(fe);
        setRootError(re);
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
      isPending={isPending}
      fieldErrors={fieldErrors}
      rootError={rootError ?? undefined}
    />
  );
}
