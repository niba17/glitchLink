"use client";

import Modal from "../Modal";
import { useState } from "react";
import AuthForm from "../../form/Auth";
import Toast from "@/components/toast/Toast";
import { signIn } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

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
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setIsAuthenticated } = useAuth();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setEmailError("");
    setPasswordError("");
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    (e.nativeEvent as SubmitEvent).submitter?.blur();

    setEmailError("");
    setPasswordError("");

    try {
      const res = await signIn({ email, password });
      localStorage.setItem("token", res.token);
      setIsAuthenticated(true);
      Toast.success(res.message || "Login successful");

      // ⬇️ Redirect ke halaman /links setelah login sukses
      handleClose();
      router.push("/links");
    } catch (err: any) {
      const errors = err?.errors;
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
        {/* Email */}
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
          {emailError && (
            <p className="text-red-500 text-[0.8vw] mt-[0.3vw]">{emailError}</p>
          )}
        </div>

        {/* Password */}
        <div className="w-full relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`rounded-lg w-full p-[0.8vw] pr-[2.5vw] bg-zinc-950 border ${
              passwordError ? "border-red-500" : "border-transparent"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-[0.8vw] top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            tabIndex={-1}
            title="Show password"
          >
            {showPassword ? (
              <EyeOff className="w-[1.2vw] h-[1.2vw]" />
            ) : (
              <Eye className="w-[1.2vw] h-[1.2vw]" />
            )}
          </button>
          {passwordError && (
            <p className="text-red-500 text-[0.8vw] mt-[0.3vw]">
              {passwordError}
            </p>
          )}
        </div>
      </AuthForm>
    </Modal>
  );
}
