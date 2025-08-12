export async function fetchUser() {
  const res = await fetch("http://localhost:3000/api/user", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}
