"use client";

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import clsx from "clsx";
import Image from "next/image";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "primary" | "light" | "danger";
  size?: "sm" | "md" | "lg" | "none";
  iconSrc?: string; // ✅ Tambahkan path icon (dari /public)
  iconAlt?: string;
  children?: ReactNode; // tetap ada untuk teks
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      iconSrc,
      iconAlt = "icon",
      children,
      ...props
    },
    ref
  ) => {
    const base =
      "transition-colors duration-150 inline-flex items-center justify-center gap-2";
    const variants = {
      default: "text-stone-200 hover:text-stone-400",
      outline: "border border-white text-white hover:bg-white hover:text-black",
      ghost: "bg-transparent hover:bg-white/10 text-white",
      primary:
        "bg-[#159976] hover:bg-[#0e7056] focus:ring-2 focus:outline-none focus:ring-[#1de2ae] font-medium rounded-lg text-[1vw] w-full h-[3vw] text-center",
      light:
        "bg-white hover:bg-stone-300 focus:ring-2 focus:outline-none focus:ring-white font-medium rounded-lg text-[1vw] w-full h-[3vw] text-center text-black",
      danger:
        "bg-[#db4646] hover:bg-red-700 focus:ring-2 focus:outline-none focus:ring-white font-medium rounded-lg text-[1vw] w-full h-[3vw] text-center text-white",
    };
    const sizes = {
      sm: "px-[0.6vw] py-[0.3vw] text-[0.7vw]",
      md: "px-[1vw] py-[0.5vw] text-[0.8vw]",
      lg: "px-[1.2vw] py-[0.6vw] text-[0.9vw]",
      none: "",
    };

    return (
      <button
        ref={ref}
        className={clsx(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {iconSrc && (
          <Image
            src={iconSrc}
            alt={iconAlt}
            width={20}
            height={20}
            className="w-[2vw] h-[2vw]"
          />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
