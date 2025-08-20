"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

interface SignInFormUIProps {
  email: string;
  password: string;
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  error: string;
}

export default function SignInFormUI({
  email,
  password,
  setEmail,
  setPassword,
  onSubmit,
  loading,
  error,
}: SignInFormUIProps) {
  return (
    <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
      {error && <p className="text-sm text-red-500">{error}</p>}

      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="flex justify-end space-x-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
}
