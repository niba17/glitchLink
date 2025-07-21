// src/middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from "express";

// Middleware penanganan error kustom
// Ingat: Express mengenali middleware error dari 4 parameter
export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error ke konsol server untuk debugging
  console.error("Error caught by errorMiddleware:", err);

  // Tentukan status code. Default 500 (Internal Server Error)
  const statusCode = err.status || err.statusCode || 500;

  // Tentukan pesan error. Default pesan umum.
  // Hindari mengirimkan detail error sensitif (misal: stack trace) di produksi
  const message = err.message || "An unexpected error occurred";

  res.status(statusCode).json({
    status: "error",
    message: message,
    // Di lingkungan produksi, jangan sertakan stack trace untuk keamanan
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
