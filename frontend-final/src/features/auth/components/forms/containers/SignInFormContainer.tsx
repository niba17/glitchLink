"use client";

import { useState } from "react";
import SignInFormUI from "../UI/SignInFormUI";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SignInPayload } from "../../../types/auth";

interface Props {
  onClose?: () => void;
}

export default function SignInFormContainer({ onClose }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [rootError, setRootError] = useState<string | null>(null);

  const { signIn, signInStatus } = useAuth(); // signIn adalah function mutate

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setRootError(null);

    const payload: SignInPayload = { email, password };

    signIn(payload, {
      onSuccess: () => {
        if (onClose) onClose(); // menutup dialog
      },
      onError: (err: any) => {
        let fe: Record<string, string> = {};
        let re: string | null = "User login failed";

        if (err?.isAxiosError) {
          const data = err.response?.data;
          if (data) {
            if (Array.isArray(data.errors) && data.errors.length) {
              data.errors.forEach((e: { path: string; message: string }) => {
                fe[e.path] = e.message || "";
              });
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
      isPending={signInStatus === "pending"}
      fieldErrors={fieldErrors}
      rootError={rootError ?? undefined}
    />
  );
}
