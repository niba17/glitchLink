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
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setEmailError("");
    setPasswordError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    // Hilangkan fokus dari tombol submit (agar tidak terus ter-highlight)
    (e.nativeEvent as SubmitEvent).submitter?.blur();

    // Reset error state
    setEmailError("");
    setPasswordError("");

    try {
      const res = await signIn({ email, password });

      localStorage.setItem("token", res.token);
      Toast.success(res.message || "Login successful");
    } catch (err: any) {
      // Reset error dulu
      setEmailError("");
      setPasswordError("");

      const errors = err?.errors?.errors;
      if (errors && Array.isArray(errors)) {
        errors.forEach((error: any) => {
          if (error.path === "email") {
            setEmailError(error.message || " ");
          } else if (error.path === "password") {
            setPasswordError(error.message || " ");
          }
        });
      }

      Toast.error(err?.message || "Login failed");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
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
        <div className="w-full">
          <input
            type="email"
            placeholder="Email"
            className={`rounded-lg w-full p-[0.8vw] bg-zinc-950 border ${
              emailError ? "border-red-500" : "border-transparent"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* {emailError && (
            <p className="text-red-500 text-sm mt-1">{emailError}</p>
          )} */}
        </div>

        <div className="w-full">
          <input
            type="password"
            placeholder="Password"
            className={`rounded-lg w-full p-[0.8vw] bg-zinc-950 border ${
              passwordError ? "border-red-500" : "border-transparent"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )} */}
        </div>
      </AuthForm>
    </Modal>
  );
}
