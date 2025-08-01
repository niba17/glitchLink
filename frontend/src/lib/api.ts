// lib/api.ts

export async function shortenUrl(originalUrl: string, customAlias?: string) {
  const res = await fetch("http://localhost:3000/api/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ originalUrl, customAlias }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw data; // ⬅️ fix disini
  }

  return data.data;
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
    throw err; // <-- bukan `new Error(err.message)`
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
    throw err; // <-- bukan `new Error(err.message)`
  }

  return await res.json();
}
