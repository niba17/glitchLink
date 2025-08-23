export function formatExpiresAtForApi(expiresAt?: string): string | undefined {
  if (!expiresAt) return undefined;
  return expiresAt.includes(" ") ? expiresAt.replace(" ", "T") : expiresAt;
}
