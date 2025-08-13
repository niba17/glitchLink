"use client";

import Modal from "@/components/modals/Modal";
import Button from "@/components/buttons/Button";
import Input from "@/components/inputs/Input";
import { useState } from "react";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignIn: () => void;
}

export default function SignUpModal({
  isOpen,
  onClose,
  onSwitchToSignIn,
}: SignUpModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up with:", { name, email, password });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign Up">
      <form onSubmit={handleSubmit} className="flex flex-col gap-[1vw]">
        <Input
          id="name"
          label="Name"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <Button type="submit" variant="primary">
          Sign Up
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
      </form>
    </Modal>
  );
}
