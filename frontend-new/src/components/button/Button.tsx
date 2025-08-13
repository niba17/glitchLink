// src/components/button/Button.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  const base =
    "rounded-[0.5vw] text-center transition-colors focus:outline-none focus:ring-[0.1vw] w-full";
  const variants: Record<Variant, string> = {
    primary: "bg-[#159976] hover:bg-[#0e7056] focus:ring-[#1de2ae] text-white",
  };

  return (
    <button
      className={cn(
        base,
        variants[variant],
        "text-[1.5vw] h-[3.5vw]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
