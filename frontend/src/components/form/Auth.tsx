"use client";

import { ReactNode } from "react";
import { Button } from "../button/Button";

type AuthFormProps = {
  title: string;
  subtitle?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthForm({
  title,
  subtitle,
  onSubmit,
  children,
  footer,
}: AuthFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-[1vw] text-white w-full text-[1vw]"
    >
      <div>
        <h2 className="text-[1.2vw] font-semibold text-center">{title}</h2>
        {subtitle && <p className="text-[0.8vw] text-stone-400">{subtitle}</p>}
      </div>

      {children}

      <Button type="submit" variant="primary">
        Submit
      </Button>
      <Button variant="light" iconSrc="/google.svg" iconAlt="Google">
        Sign with Google
      </Button>

      {footer && (
        <div className="text-[0.7vw] text-stone-400 mt-[0.6vw] text-center">
          {footer}
        </div>
      )}
    </form>
  );
}
