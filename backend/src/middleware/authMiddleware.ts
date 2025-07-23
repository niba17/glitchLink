// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Perluas interface Request untuk TypeScript agar bisa menambahkan properti user
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; email: string };
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No token provided or invalid format." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Pastikan process.env.JWT_SECRET sudah diset di .env
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    // PENTING: Pastikan token yang dibuat di userService menggunakan 'userId'
    // Contoh payload: { userId: user.id, email: user.email }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }, // Membaca userId dari token
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found." });
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (error: any) {
    // Tangani error JWT secara spesifik untuk pesan yang lebih jelas
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Unauthorized: Token has expired." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized: Invalid token." });
    }
    // Untuk error lain yang tidak terduga
    res.status(500).json({ message: "Authentication failed." });
  }
};
