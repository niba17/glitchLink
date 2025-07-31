"use client";

import Modal from "../Modal";
import { useState } from "react";
import AuthForm from "../../form/Auth";
import Toast from "@/components/toast/Toast";
import { signIn } from "@/lib/api";

type SignInModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
};

export default function SignInModal({
  isOpen,
  onClose,
  onSwitchToSignUp,
}: SignInModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await signIn({ email, password });

      // Simpan token (opsional: kamu bisa pakai cookies juga)
      localStorage.setItem("token", res.token);

      // Tampilkan toast dengan pesan dari backend
      Toast.success(res.message || "Login successful");

      onClose();
      // Jika memang kamu ingin redirect ke halaman lain, kamu bisa tambahkan di sini
    } catch (err: any) {
      Toast.error(err.message || "Failed to login");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <AuthForm
        title="Sign In"
        onSubmit={handleSignIn}
        footer={
          <p className="text-[1vw] text-center">
            Don’t have an account?{" "}
            <button
              onClick={onSwitchToSignUp}
              className="underline text-stone-300 hover:text-stone-100"
            >
              Sign up here
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
