"use client";

import Modal from "../ui/Modal";
import { useState } from "react";
import AuthForm from "../form/Auth";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
};

export default function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement login logic
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <AuthForm
        title="Sign In"
        onSubmit={handleLogin}
        footer={
          <p className="text-[1vw] text-center">
            Don’t have an account?{" "}
            <button
              onClick={onSwitchToRegister}
              className="underline text-stone-300 hover:text-stone-100"
            >
              Register here
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
      </AuthForm>
    </Modal>
  );
}
