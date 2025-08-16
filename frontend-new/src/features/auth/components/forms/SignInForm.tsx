"use client";

import Modal from "@/components/modals/Modal";
import Button from "@/components/buttons/Button";
import Input from "@/components/inputs/Input";
import { useState } from "react";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useSignIn } from "@/features/auth/hooks/useSignIn";
import { useRouter } from "next/navigation";

interface SignInFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

export default function SignInForm({
  isOpen,
  onClose,
  onSwitchToSignUp,
}: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const { signIn, loading, fieldErrors, resetErrors } = useSignIn();
  const router = useRouter();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    resetErrors();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await signIn({ email, password });
      login(data.token); // simpan token via context
      resetForm();
      onClose();
      router.push("/links");
    } catch {
      // error sudah ditangani di hook
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Sign In">
      <form onSubmit={handleSubmit} aria-busy={loading}>
        <div className="flex flex-col space-y-[0.6vw]">
          <div className="flex flex-col space-y-[0.1vw]">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              required
            />

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              required
            />
          </div>

          <div className="flex flex-col space-y-[0.5vw]">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-[1vw] text-stone-400 text-center">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="text-[#159976] hover:underline"
                onClick={onSwitchToSignUp}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </form>
    </Modal>
  );
}
