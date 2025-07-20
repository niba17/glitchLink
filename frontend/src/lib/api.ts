// lib/api.ts
export async function shortenUrl(original: string, customCode?: string) {
  const res = await fetch("http://localhost:4000/api/shorten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ original, customCode }),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || "Failed to shorten URL");
    (error as any).status = res.status; // tambahkan status ke error
    throw error;
  }

  return data;
}
