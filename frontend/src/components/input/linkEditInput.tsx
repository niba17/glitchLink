"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { Calendar } from "lucide-react"; // Icon kalender
import clsx from "clsx";

export type LinkInputRef = {
  focus: () => void;
  blur: () => void;
};

type LinkInputEditProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

const LinkInputEdit = forwardRef<LinkInputRef, LinkInputEditProps>(
  ({ error, type = "text", className, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
    }));

    return (
      <div className="w-full relative">
        <input
          ref={inputRef}
          type={type}
          className={clsx(
            "rounded-lg w-full p-[0.8vw] bg-zinc-950 border",
            error ? "border-red-500" : "border-transparent",
            type === "date" ? "pr-[2.5vw]" : "",
            className
          )}
          {...props}
        />
        {type === "date" && (
          <Calendar className="absolute right-[0.8vw] top-1/2 -translate-y-1/2 w-[1.2vw] h-[1.2vw] text-stone-200 pointer-events-none" />
        )}
        {error && (
          <p className="text-red-500 text-[0.8vw] mt-[0.3vw]">{error}</p>
        )}
      </div>
    );
  }
);

LinkInputEdit.displayName = "LinkInputEdit";
export default LinkInputEdit;
