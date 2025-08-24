"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateShortLinkFormUIProps {
  originalUrl: string;
  customAlias: string;
  onChangeOriginal: (val: string) => void;
  onChangeAlias: (val: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function CreateShortLinkFormUI({
  originalUrl,
  customAlias,
  onChangeOriginal,
  onChangeAlias,
  onSubmit,
}: CreateShortLinkFormUIProps) {
  return (
    <form className="flex flex-col space-y-5" onSubmit={onSubmit}>
      <div className="flex flex-col space-y-3">
        <div className="flex flex-col space-y-2">
          <Label className="text-lg" htmlFor="originalUrl">
            Original Link
          </Label>
          <Input
            id="originalUrl"
            placeholder="https://example.com"
            type="url"
            value={originalUrl}
            onChange={(e) => onChangeOriginal(e.target.value)}
          />
        </div>
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
      </div>

      <Button type="submit" variant="default" className="text-[20px] h-14">
        Get Short Link
      </Button>
    </form>
  );
}
