"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SignUpFormUI from "../UI/SignUpFormUI";
import { useAuth, AuthErrorParsed } from "@/features/auth/hooks/useAuth";
import { SignUpPayload } from "../../../types/auth";
import { useDialogStore } from "@/store/useDialogStore";

interface Props {
  onClose?: () => void;
}

export default function SignUpFormContainer({ onClose }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [rootError, setRootError] = useState<string | null>(null);

  const { signUpAsync, signUpStatus, parseAuthError } = useAuth();
  const router = useRouter();

  // Trigger global GuestLinks dialog
  const openGuestLinksLoginActionDialogContainer = useDialogStore(
    (state) => state.openGuestLinksLoginActionDialogContainer
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setRootError(null);

    const payload: SignUpPayload = { email, password, confirmPassword };

    try {
      const res = await signUpAsync(payload); // pakai mutateAsync

      const token = res.data?.token;
      if (token) {
        // Trigger dialog global untuk import guest links
        openGuestLinksLoginActionDialogContainer(token);
      }

      if (onClose) onClose();
      // router.push("/links") jangan disini
    } catch (err: any) {
      const parsed: AuthErrorParsed = parseAuthError(err);
      const updatedFieldErrors: Record<string, string> = {};
      ["email", "password", "confirmPassword"].forEach((key) => {
        updatedFieldErrors[key] =
          parsed.fieldErrors[key] && parsed.fieldErrors[key] !== ""
            ? parsed.fieldErrors[key]
            : parsed.rootError;
      });
      setFieldErrors(updatedFieldErrors);
      setRootError(parsed.rootError);
    }
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
