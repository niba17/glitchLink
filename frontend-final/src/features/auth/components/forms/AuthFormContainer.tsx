// src/features/auth/components/forms/AuthFormContainer.tsx
"use client";

import { useState } from "react";
import SignInFormContainer from "./SignInFormContainer";
import SignUpFormContainer from "./SignUpFormContainer";

export default function AuthFormContainer() {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");

  const toggleMode = () =>
    setMode((prev) => (prev === "signIn" ? "signUp" : "signIn"));

  return (
    <div className="flex flex-col space-y-4">
      {mode === "signIn" ? <SignInFormContainer /> : <SignUpFormContainer />}
      <div className="text-center text-sm mt-2">
        {mode === "signIn" ? (
          <>
            Doesn't have any account yet?{" "}
            <span
              className="text-[#159976] hover:text-[#159976]/70 hover:cursor-pointer"
              onClick={toggleMode}
            >
              Sign Up here
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span
              className="text-[#159976] hover:text-[#159976]/70 hover:cursor-pointer"
              onClick={toggleMode}
            >
              Sign In here
            </span>
          </>
        )}
      </div>
    </div>
  );
}
