"use client";

import React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "icon";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const base = "rounded-[0.5vw] text-center transition-colors outline-none";
  const variants: Record<Variant, string> = {
    primary:
      "bg-[#159976] hover:bg-[#0e7056] focus:ring-[#1de2ae] text-stone-200 w-full p-[0.5vw] focus:outline-none focus:ring-[0.1vw]",
    ghost: "bg-transparent text-stone-200 w-full",
    icon: "bg-transparent hover:bg-zinc-700 text-stone-200 p-[0.3vw] rounded-[0.4vw] w-auto focus:outline-none focus:ring-[#1de2ae] focus:ring-[0.1vw]",
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
