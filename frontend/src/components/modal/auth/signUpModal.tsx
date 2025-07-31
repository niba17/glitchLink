"use client";

import Modal from "../Modal";
import { useState } from "react";
import AuthForm from "../../form/Auth";
import { signUp } from "@/lib/api";
import Toast from "@/components/toast/Toast";

type SignUpModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
};

export default function SignUpModal({
  isOpen,
  onClose,
  onSwitchToSignIn,
}: SignUpModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await signUp({ email, password, confirmPassword });

      Toast.success(res.message || "Account created. You can now sign in.");

      onClose();
      onSwitchToSignIn();
    } catch (err: any) {
      Toast.error(err.message || "Failed to register");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <AuthForm
        title="Sign Up"
        onSubmit={handleSignUp}
        footer={
          <p className="text-[1vw] text-center">
            Already have an account?{" "}
            <button
              onClick={onSwitchToSignIn}
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
