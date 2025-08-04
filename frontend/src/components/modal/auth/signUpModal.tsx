"use client";

import Modal from "../Modal";
import { useState, useEffect } from "react";
import AuthForm from "../../form/Auth";
import { signUp } from "@/lib/api";
import Toast from "@/components/toast/Toast";
import { Eye, EyeOff } from "lucide-react";

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

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setEmailError("");
      setPasswordError("");
      setConfirmPasswordError("");
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [isOpen]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    (document.activeElement as HTMLElement)?.blur();

    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    try {
      const res = await signUp({ email, password, confirmPassword });

      Toast.success(res.message || "Account created. You can now sign in");
      onClose();
      onSwitchToSignIn();
    } catch (err: any) {
      Toast.error(err.message || "Failed to register");

      const fieldErrors = err?.errors;
      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach((e: { path: string; message: string }) => {
          if (e.path === "email") setEmailError(e.message);
          if (e.path === "password") setPasswordError(e.message);
          if (e.path === "confirmPassword") setConfirmPasswordError(e.message);
        });
      }
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
        <div className="space-y-1 w-full">
          <input
            type="email"
            placeholder="Email"
            className={`rounded-lg w-full p-[0.8vw] bg-zinc-950 ${
              emailError ? "border border-red-500" : ""
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {emailError && (
            <p className="text-[1vw] text-red-500">{emailError}</p>
          )}
        </div>

        <div className="w-full space-y-1">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`rounded-lg w-full p-[0.8vw] bg-zinc-950 pr-[2.5vw] ${
                passwordError ? "border border-red-500" : ""
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[0.8vw] top-1/2 -translate-y-1/2 text-zinc-400"
              title="Show password"
            >
              {showPassword ? (
                <EyeOff className="w-[1.2vw] h-[1.2vw]" />
              ) : (
                <Eye className="w-[1.2vw] h-[1.2vw]" />
              )}
            </button>
          </div>
          {passwordError && (
            <p className="text-[1.10vw] text-red-500">{passwordError}</p>
          )}
        </div>

        <div className="w-full space-y-1">
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className={`rounded-lg w-full p-[0.8vw] pr-[2.5vw] bg-zinc-950 ${
                confirmPasswordError ? "border border-red-500" : ""
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute top-1/2 right-[0.8vw] -translate-y-1/2 text-zinc-400 hover:text-zinc-100"
              title="Show confirm password"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-[1.2vw] h-[1.2vw]" />
              ) : (
                <Eye className="w-[1.2vw] h-[1.2vw]" />
              )}
            </button>
          </div>
          {confirmPasswordError && (
            <p className="text-[1vw] text-red-500">{confirmPasswordError}</p>
          )}
        </div>
      </AuthForm>
    </Modal>
  );
}
