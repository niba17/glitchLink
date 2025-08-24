// frontend-final/src/components/ui/datetime-input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

const DateTimeInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type = "datetime-local", ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-14 w-full rounded-sm bg-zinc-800 px-5 py-2 text-base",
        "file:border-0 focus-visible:outline-none",
        "focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "calendar-picker-icon",
        className
      )}
      {...props}
    />
  );
});
DateTimeInput.displayName = "DateTimeInput";

export { DateTimeInput };
