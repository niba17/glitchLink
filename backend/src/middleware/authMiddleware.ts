// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client"; // Untuk mencari user di DB

const prisma = new PrismaClient();

// Perluas tipe Request dari Express untuk menambahkan properti user
// Ini memungkinkan kita menyimpan data user yang terautentikasi di objek req
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Ambil token dari header Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No token provided or invalid format" });
  }

  const token = authHeader.split(" ")[1]; // Ambil token setelah "Bearer "

  // 2. Verifikasi token
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      id: number;
      email: string;
    };

    // 3. Cari user di database untuk memastikan user masih ada
    // Ini adalah langkah penting untuk keamanan (misal: jika user dihapus setelah token dibuat)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true }, // Hanya ambil id dan email
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // 4. Tambahkan informasi user ke objek request
    req.user = user; // Sekarang, controller selanjutnya bisa mengakses req.user.id atau req.user.email
    next(); // Lanjutkan ke middleware/controller berikutnya
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    // Tangani error lainnya
    next(error); // Teruskan ke middleware penanganan error umum
  }
};
