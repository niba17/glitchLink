"use client";

import { ReactNode } from "react";

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
      className="flex flex-col gap-[1vw] text-white w-full text-[1.2vw]"
    >
      <div>
        <h2 className="text-[1.2vw] font-semibold text-center">{title}</h2>
        {subtitle && <p className="text-[0.8vw] text-stone-400">{subtitle}</p>}
      </div>

      {children}

      <button
        type="submit"
        className="bg-[#159976] hover:bg-[#0e7056] focus:ring-2 focus:outline-none focus:ring-[#1de2ae] font-medium rounded-lg text-[1vw] w-full py-[0.8vw] text-center"
      >
        {title}
      </button>

      {footer && (
        <div className="text-[0.7vw] text-stone-400 mt-[0.6vw] text-center">
          {footer}
        </div>
      )}
    </form>
  );
}
