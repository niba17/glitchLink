"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

type InputProps = {
  label?: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-[0.5vw] text-[1.3vw]">
        {label && (
          <label htmlFor={id} className="text-[1.4vw]">
            {label}
          </label>
        )}

        <input
          id={id}
          ref={ref}
          {...props}
          className={cn(
            "bg-zinc-800 rounded-[0.5vw] w-full p-[0.8vw] placeholder:text-stone-400 focus:outline-none focus:ring-[0.1vw] focus:ring-stone-400",
            error ? "border-red-500" : "border-transparent",
            className
          )}
        />

        <div className="h-[1vw] mt-[-0.2vw]">
          {error ? (
            <p className="text-[1vw] text-red-600" role="alert">
              {error}
            </p>
          ) : (
            // Placeholder kosong agar tinggi tetap sama
            <span className="invisible text-[1vw]">&nbsp;</span>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
