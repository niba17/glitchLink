"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateShortLinkFormUIProps {
  originalUrl: string;
  customAlias: string;
  expiresAt: string; // <- tambahkan
  onChangeOriginal: (val: string) => void;
  onChangeAlias: (val: string) => void;
  onChangeExpiresAt: (val: string) => void; // <- tambahkan
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  fieldErrors?: Record<string, string>;
  isPending?: boolean;
}

export default function CreateShortLinkFormUI({
  originalUrl,
  customAlias,
  expiresAt, // <- tambahkan
  onChangeOriginal,
  onChangeAlias,
  onChangeExpiresAt, // <- tambahkan
  onSubmit,
  fieldErrors,
  isPending,
}: CreateShortLinkFormUIProps) {
  return (
    <form className="flex flex-col space-y-5" onSubmit={onSubmit}>
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
            <p className="text-sm text-red-500">{fieldErrors.originalUrl}</p>
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
            <p className="text-sm text-red-500">{fieldErrors.customAlias}</p>
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
            <p className="text-sm text-red-500">{fieldErrors.expiresAt}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        variant="default"
        className="text-[20px] h-14"
        disabled={isPending}
      >
        {isPending ? "Creating..." : "Get Short Link"}
      </Button>
    </form>
  );
}
