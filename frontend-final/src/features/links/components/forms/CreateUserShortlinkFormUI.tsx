"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@/components/ui/dialog";

interface CreateShortLinkFormUIProps {
  originalUrl: string;
  customAlias: string;
  expiresAt: string;
  onChangeOriginal: (val: string) => void;
  onChangeAlias: (val: string) => void;
  onChangeExpiresAt: (val: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  fieldErrors?: Record<string, string>;
  isPending?: boolean;
  rootError?: string;
}

export default function CreateShortLinkFormUI({
  originalUrl,
  customAlias,
  expiresAt,
  onChangeOriginal,
  onChangeAlias,
  onChangeExpiresAt,
  onSubmit,
  fieldErrors,
  isPending,
  rootError,
}: CreateShortLinkFormUIProps) {
  return (
    <form className="flex flex-col space-y-5" onSubmit={onSubmit}>
      {rootError && (
        <p className="text-sm font-extrabold text-red-500">{rootError}</p>
      )}

      <div className="flex flex-col space-y-2">
        <div className="flex flex-col space-y-1">
          <Label className="text-lg" htmlFor="originalUrl">
            Original Link
          </Label>
          <Input
            id="originalUrl"
            placeholder="https://example.com"
            type="url"
            value={originalUrl}
            onChange={(e) => onChangeOriginal(e.target.value)}
            className={
              fieldErrors?.originalUrl
                ? "border border-red-500 focus:ring-red-500"
                : ""
            }
          />
          {fieldErrors?.originalUrl && (
            <p className="text-sm text-red-600">{fieldErrors.originalUrl}</p>
          )}
        </div>

        <div className="flex flex-col space-y-1">
          <Label className="text-lg" htmlFor="customAlias">
            Alias (Optional)
          </Label>
          <Input
            id="customAlias"
            placeholder="your-alias"
            type="text"
            value={customAlias}
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

        <div className="flex flex-col space-y-1">
          <Label className="text-lg" htmlFor="expiresAt">
            Expiration Date (Optional)
          </Label>
          <Input
            id="expiresAt"
            type="datetime-local"
            value={expiresAt || ""}
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

      {/* Tombol Cancel + Submit */}
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
