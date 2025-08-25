// frontend-final/src/features/links/utils/dateFormatters.ts

/**
 * FE → BE: hapus detik, ganti "T" → spasi
 * Contoh: "2025-08-25T10:30" → "2025-08-25 10:30"
 */
export function normalizeExpiresAt(val: string | null): string | null {
  if (!val) return null;
  return val.replace("T", " ").replace(/:00$/, "");
}

/**
 * BE → FE: format agar bisa dipakai <input type="datetime-local" />
 * Contoh: "2025-08-25 10:30:00" → "2025-08-25T10:30"
 */
export function formatForInput(val: string | null): string | null {
  if (!val) return null;
  return val.replace(" ", "T").slice(0, 16);
}
