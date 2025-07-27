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
