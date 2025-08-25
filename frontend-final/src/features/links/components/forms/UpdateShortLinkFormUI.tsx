// frontend-final/src/features/links/components/forms/UpdateShortLinkFormUI.tsx
"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UpdateShortLinkFormUIProps {
  customAlias: string | null;
  expiresAt: string | null;
  onChangeAlias: (val: string) => void;
  onChangeExpiresAt: (val: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
  fieldErrors?: Record<string, string>;
  rootError?: string;
}

export default function UpdateShortLinkFormUI({
  customAlias,
  expiresAt,
  onChangeAlias,
  onChangeExpiresAt,
  onSubmit,
  isPending,
  fieldErrors,
  rootError,
}: UpdateShortLinkFormUIProps) {
  return (
    <form className="flex flex-col space-y-5" onSubmit={onSubmit}>
      {rootError && (
        <p className="text-sm font-extrabold text-red-500">{rootError}</p>
      )}
      <div className="flex flex-col space-y-3">
        {/* Custom Alias */}
        <div className="flex flex-col space-y-1">
          <Label className="text-lg" htmlFor="customAlias">
            Alias (Optional)
          </Label>
          <Input
            id="customAlias"
            placeholder="your-alias"
            type="text"
            value={customAlias ?? ""}
            onChange={(e) => onChangeAlias(e.target.value)}
            className={
              fieldErrors?.customAlias
                ? "border border-red-500 focus:ring-red-500"
                : ""
            }
          />
          {fieldErrors?.customAlias && (
            <p className="text-sm text-red-600">{fieldErrors.customAlias}</p>
          )}
        </div>

        {/* Expiration Date */}
        <div className="flex flex-col space-y-1">
          <Label className="text-lg" htmlFor="expiresAt">
            Expiration Date (Optional)
          </Label>
          <Input
            id="expiresAt"
            placeholder="yyyy-mm-dd hh:mm"
            type="datetime-local"
            value={expiresAt ?? ""} // <-- fallback
            onChange={(e) => onChangeExpiresAt(e.target.value)}
            className={
              fieldErrors?.expiresAt
                ? "border border-red-500 focus:ring-red-500"
                : ""
            }
          />

          {fieldErrors?.expiresAt && (
            <p className="text-sm text-red-600">{fieldErrors.expiresAt}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Loading..." : "Get Short Link"}
        </Button>
      </div>
    </form>
  );
}
