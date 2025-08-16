"use client";

import { useState } from "react";
import Modal from "@/components/modals/Modal";
import Button from "@/components/buttons/Button";
import Input from "@/components/inputs/Input";
import { useSignUp } from "@/features/auth/hooks/useSignUp";

interface SignUpFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
}

export default function SignUpForm({
  isOpen,
  onClose,
  onSwitchToSignIn,
}: SignUpFormProps) {
  const { signUp, loading, fieldErrors, resetErrors } = useSignUp();

  // local state untuk input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    resetErrors(); // clear error juga
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp({ email, password, confirmPassword });
      handleClose(); // sukses -> close modal & reset
    } catch {
      // error sudah ditangani hook (toast + fieldErrors)
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Sign Up">
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

            <Input
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={fieldErrors.confirmPassword}
              required
            />
          </div>

          <div className="flex flex-col space-y-[0.5vw]">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </Button>

            <p className="text-[1vw] text-stone-400 text-center">
              Already have an account?{" "}
              <button
                type="button"
                className="text-[#159976] hover:underline"
                onClick={onSwitchToSignIn}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </form>
    </Modal>
  );
}
