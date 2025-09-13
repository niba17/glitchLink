import { useState } from "react";
import SignInFormUI from "../UI/SignInFormUI";
import { useAuth, AuthErrorParsed } from "@/features/auth/hooks/useAuth";
import { SignInPayload } from "../../../types/auth";

interface Props {
  onClose?: () => void;
}

export default function SignInFormContainer({ onClose }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [rootError, setRootError] = useState<string | null>(null);

  const { signIn, signInStatus, parseAuthError } = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setRootError(null);

    const payload: SignInPayload = { email, password };

    signIn(payload, {
      onSuccess: () => {
        if (onClose) onClose();
      },
      onError: (err: any) => {
        const parsed: AuthErrorParsed = parseAuthError(err);

        // Jika field error kosong, gunakan rootError sebagai pesan field
        const updatedFieldErrors: Record<string, string> = {};
        ["email", "password"].forEach((key) => {
          updatedFieldErrors[key] =
            parsed.fieldErrors[key] && parsed.fieldErrors[key] !== ""
              ? parsed.fieldErrors[key]
              : parsed.rootError;
        });

        setFieldErrors(updatedFieldErrors);
        setRootError(parsed.rootError);
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
      fieldErrors={fieldErrors}
      rootError={rootError ?? undefined}
      isPending={signInStatus === "pending"}
    />
  );
}
