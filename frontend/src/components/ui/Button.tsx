"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "text";
  size?: "sm" | "md" | "lg" | "none";
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const base = "transition-colors duration-150";
    const variants = {
      default: "text-stone-200 hover:text-stone-400",
      outline: "border border-white text-white hover:bg-white hover:text-black",
      ghost: "bg-transparent hover:bg-white/10 text-white",
      text: "text-stone-200 hover:text-stone-400 bg-transparent p-0 border-none",
    };
    const sizes = {
      sm: "px-[0.6vw] py-[0.3vw] text-[0.7vw]",
      md: "px-[1vw] py-[0.5vw] text-[0.8vw]",
      lg: "px-[1.2vw] py-[0.6vw] text-[0.9vw]",
      none: "", // no padding or font-size
    };

    return (
      <button
        ref={ref}
        className={clsx(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };
