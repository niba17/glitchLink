"use client";

import { ReactNode } from "react";
import { Button } from "../button/Button";

type Edit = {
  title?: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  footer?: ReactNode;
};

export default function Edit({
  title = "Edit Link",
  onSubmit,
  children,
  footer,
}: Edit) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-[1vw] text-stone-200 text-[1vw]"
    >
      {title && (
        <h2 className="text-[1.5vw] font-semibold text-center">{title}</h2>
      )}

      {children}

      <Button type="submit" variant="primary">
        Save
      </Button>

      {footer && (
        <div className="text-[0.7vw] mt-[0.6vw] text-center">{footer}</div>
      )}
    </form>
  );
}
