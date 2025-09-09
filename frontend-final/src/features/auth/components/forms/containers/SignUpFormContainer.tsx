"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SignUpFormUI from "../UI/SignUpFormUI";
import { useAuth, AuthErrorParsed } from "@/features/auth/hooks/useAuth";
import { SignUpPayload } from "../../../types/auth";

interface Props {
  onClose?: () => void;
}

export default function SignUpFormContainer({ onClose }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [rootError, setRootError] = useState<string | null>(null);

  const { signUp, signUpStatus, parseAuthError } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setRootError(null);

    const payload: SignUpPayload = { email, password, confirmPassword };

    signUp(payload, {
      onSuccess: () => {
        if (onClose) onClose();
        router.push("/links");
      },
      onError: (err: any) => {
        const parsed: AuthErrorParsed = parseAuthError(err);
        setFieldErrors(parsed.fieldErrors);
        setRootError(parsed.rootError);
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
      isPending={signUpStatus === "pending"}
    />
  );
}
