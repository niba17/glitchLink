"use client";

import { useState } from "react";
import SignUpFormUI from "../UI/SignUpFormUI";
import { useAuth } from "@/features/auth/hooks/useAuth";
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

  const { signUp, signUpStatus } = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setRootError(null);

    const payload: SignUpPayload = { email, password, confirmPassword };

    signUp(payload, {
      onSuccess: () => {
        if (onClose) onClose();
      },
      onError: (err: any) => {
        let fe: Record<string, string> = {};
        let re: string | null = null;

        const data = err?.response?.data;

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
              fe = { email: "", password: "", confirmPassword: "" };
            }
          }
          if (data.message) {
            re = data.message;
          }
        }

        if (!re) {
          re = err?.message || "Failed to sign up";
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
      isPending={signUpStatus === "pending"}
      rootError={rootError ?? undefined}
    />
  );
}
