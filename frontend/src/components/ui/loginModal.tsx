"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

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
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 text-stone-200">
      <div className="relative bg-zinc-800 rounded-lg p-[1vw] w-[25vw]">
        <button
          onClick={onClose}
          className="absolute top-[0.5vw] right-[0.5vw] text-stone-400 hover:text-red-500 focus:outline-none"
          aria-label="Close"
          title="close"
        >
          <X style={{ width: "1.5vw", height: "1.5vw" }} />
        </button>

        <form className="flex flex-col space-y-[1.8vw] text-[0.8vw]">
          <div className="space-y-[1vw]">
            <div className="space-y-[0.5vw]">
              <label htmlFor="username" className="text-[1vw] font-medium">
                Username or Email
              </label>
              <input
                autoFocus
                autoComplete="off"
                type="text"
                id="username"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                className="bg-zinc-950 rounded-lg w-full p-[0.5vw]"
                placeholder="your username or email ..."
                required
              />
            </div>
            <div className="space-y-[0.5vw]">
              <label htmlFor="password" className="text-[1vw] font-medium">
                Password
              </label>
              <input
                autoComplete="off"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-950 rounded-lg w-full p-[0.5vw]"
                placeholder="your password ..."
                required
              />
            </div>
          </div>
          <div className="space-y-[0.5vw] text-center">
            <button
              type="submit"
              className="bg-[#159976] hover:bg-[#0e7056] focus:ring-2 focus:outline-none focus:ring-[#1de2ae] font-medium rounded-lg text-[1vw] w-full h-[2vw]"
            >
              Submit
            </button>
            <button
              type="button"
              className="bg-white text-black border border-stone-400 hover:bg-gray-100 font-medium rounded-lg text-[0.9vw] w-full h-[2vw] flex items-center justify-center gap-[0.5vw]"
              onClick={() => {
                console.log("Sign In with Google clicked");
              }}
            >
              <Image
                src="/google.svg"
                alt="Google"
                width={24}
                height={24}
                className="w-[1.5vw] h-[1.5vw]"
              />
              Sign In with Google
            </button>
            <div className="border-t-2"></div>
            <span className="block">
              Doesn’t have any account yet?,{" "}
              <span
                onClick={onSwitchToRegister}
                className="text-[#1de2ae] cursor-pointer hover:underline"
              >
                Sign Up here
              </span>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
