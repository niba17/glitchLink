"use client";

import Modal from "../ui/Modal";
import { useState } from "react";
import AuthForm from "../form/Auth";

type RegisterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
};

export default function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: RegisterModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement register logic
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <AuthForm
        title="Register"
        onSubmit={handleRegister}
        footer={
          <p className="text-[1vw] text-center">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="underline text-stone-300 hover:text-stone-100"
            >
              Sign in here
            </button>
          </p>
        }
      >
        <input
          type="email"
          placeholder="Email"
          className="rounded-lg w-full p-[0.8vw] bg-zinc-950"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="rounded-lg w-full p-[0.8vw] bg-zinc-950"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="rounded-lg w-full p-[0.8vw] bg-zinc-950"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </AuthForm>
    </Modal>
  );
}
