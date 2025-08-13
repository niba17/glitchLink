"use client";

import Modal from "@/components/modals/Modal";
import Button from "@/components/buttons/Button";
import Input from "@/components/inputs/Input";
import { useState } from "react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

export default function SignInModal({
  isOpen,
  onClose,
  onSwitchToSignUp,
}: SignInModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign in with:", { email, password });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign In">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-[1vw]">
          <div className="flex flex-col space-y-[0.5vw]">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col space-y-[0.5vw]">
            <Button type="submit" variant="primary">
              Sign In
            </Button>

            <p className="text-[1vw] text-stone-400 text-center">
              Don't have an account?{" "}
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
