// src/dtos/link.dto.ts
import { z } from "zod";

// Helper function untuk menambahkan protokol jika hilang
const addHttpIfMissing = (url: string) => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `http://${url}`; // Default ke http jika tidak ada
  }
  return url;
};

export const createShortLinkSchema = z.object({
  originalUrl: z
    .string()
    .trim()
    .min(1, { message: "Original URL is required" })
    .url({ message: "Invalid URL format" })
    .transform(addHttpIfMissing), // Menambahkan protokol jika hilang

  customAlias: z
    .string()
    .trim()
    .min(3, { message: "Custom alias must be at least 3 characters long" })
    .max(20, { message: "Custom alias cannot exceed 20 characters" })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Custom alias can only contain lowercase letters, numbers, and hyphens",
    })
    .optional() // Memungkinkan properti tidak ada
    .or(z.literal(null)) // Memungkinkan nilai null secara eksplisit
    .transform((e) => (e === "" ? undefined : e === null ? null : e)), // Ubah string kosong menjadi undefined, pertahankan null

  expiresAt: z
    .string()
    .datetime({ message: "Invalid datetime format" })
    .optional() // Memungkinkan properti tidak ada
    .or(z.literal(null)), // Memungkinkan nilai null secara eksplisit
});

export type CreateLinkDto = z.infer<typeof createShortLinkSchema>;

export const updateLinkSchema = z.object({
  customAlias: z
    .string()
    .trim()
    .min(3, { message: "Custom alias must be at least 3 characters long" })
    .max(20, { message: "Custom alias cannot exceed 20 characters" })
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Custom alias can only contain lowercase letters, numbers, and hyphens",
    })
    .nullable() // Memungkinkan null untuk menghapus alias
    .optional(), // Memungkinkan undefined (jika properti tidak ada dalam request)

  expiresAt: z
    .string()
    .datetime({ message: "Invalid datetime format" })
    .nullable() // Memungkinkan null untuk menghapus expiry
    .optional(), // Memungkinkan undefined
});

export type UpdateLinkDto = z.infer<typeof updateLinkSchema>;

export const getLinkAnalyticsSchema = z.object({
  linkId: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive({ message: "Link ID must be a positive number" })
  ),
});

export type GetLinkAnalyticsDto = z.infer<typeof getLinkAnalyticsSchema>;
