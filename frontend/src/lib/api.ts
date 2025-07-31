// lib/api.ts

export async function shortenUrl(originalUrl: string, customAlias?: string) {
  const res = await fetch("http://localhost:3000/api/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ originalUrl, customAlias }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Something went wrong");
  }

  const result = await res.json();
  return result.data; // <== ✅ Pastikan return-nya langsung { shortUrl, originalUrl, customAlias, ... }
}

export async function signUp(payload: {
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const res = await fetch("http://localhost:3000/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to sign up");
  }

  return await res.json();
}

export async function signIn(payload: { email: string; password: string }) {
  const res = await fetch("http://localhost:3000/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to sign in");
  }

  return await res.json();
}
