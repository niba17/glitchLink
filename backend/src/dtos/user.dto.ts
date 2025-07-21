// src/dtos/user.dto.ts
import { z } from "zod";

// Skema validasi untuk data pendaftaran pengguna
export const registerUserSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;

// --- NEW CODE ---

// Skema validasi untuk data login pengguna
export const loginUserSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }), // Tidak perlu validasi kompleks di sini, hanya cek tidak kosong
});

export type LoginUserDto = z.infer<typeof loginUserSchema>;
