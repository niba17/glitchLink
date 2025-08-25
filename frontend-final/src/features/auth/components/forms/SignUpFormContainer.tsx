"use client";

import { useState } from "react";
import SignUpFormUI from "./SignUpFormUI";
import { useSignUp } from "@/features/auth/hooks/useSignUp";
import { SignUpPayload } from "../../types/auth";

interface Props {
  onClose?: () => void;
}

export default function SignUpFormContainer({ onClose }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [rootError, setRootError] = useState<string | null>(null);

  const mutation = useSignUp();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setRootError(null);

    const payload: SignUpPayload = { email, password, confirmPassword };

    mutation.mutate(payload, {
      onSuccess: () => {
        if (onClose) onClose(); // tutup dialog setelah signup sukses
      },
      onError: (err: any) => {
        let fe: Record<string, string> = {};
        let re: string | null = "User login failed";

        if (err.isAxiosError) {
          const axiosErr = err as AxiosError<any>;
          const data = axiosErr.response?.data;
          if (data) {
            if (Array.isArray(data.errors) && data.errors.length) {
              let allEmpty = true;
              data.errors.forEach((e: { path: string; message: string }) => {
                if (e.message) {
                  fe[e.path] = e.message;
                  allEmpty = false;
                }
              });
              if (allEmpty) {
                // force semua field dari errors array mendapat efek merah
                data.errors.forEach((e: { path: string }) => {
                  fe[e.path] = "";
                });
                re = data.message || re;
              }
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
    <SignUpFormUI
      email={email}
      password={password}
      confirmPassword={confirmPassword}
      setEmail={setEmail}
      setPassword={setPassword}
      setConfirmPassword={setConfirmPassword}
      onSubmit={handleSubmit}
      fieldErrors={fieldErrors}
      rootError={rootError ?? undefined}
      isPending={mutation.isPending}
    />
  );
}
