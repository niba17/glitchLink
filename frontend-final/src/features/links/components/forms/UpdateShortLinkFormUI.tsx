"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UpdateShortLinkFormUIProps {
  customAlias: string;
  expiresAt: string;
  onChangeAlias: (val: string) => void;
  onChangeExpiresAt: (val: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
}

export default function UpdateShortLinkFormUI({
  customAlias,
  expiresAt,
  onChangeAlias,
  onChangeExpiresAt,
  onSubmit,
  isPending,
}: UpdateShortLinkFormUIProps) {
  return (
    <form className="flex flex-col space-y-6" onSubmit={onSubmit}>
      <div className="flex flex-col space-y-2">
        <Label className="text-lg" htmlFor="customAlias">
          Alias (Optional)
        </Label>
        <Input
          id="customAlias"
          placeholder="your-alias"
          type="text"
          value={customAlias}
          onChange={(e) => onChangeAlias(e.target.value)}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <Label className="text-lg" htmlFor="expiresAt">
          Expiration Date (Optional)
        </Label>
        <Input
          id="expiresAt"
          placeholder="yyyy-mm-dd hh:mm"
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => onChangeExpiresAt(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        variant="default"
        className="mt-6 h-14 text-[1rem]"
        disabled={isPending}
      >
        {isPending ? "Saving..." : "Update Link"}
      </Button>
    </form>
  );
}
