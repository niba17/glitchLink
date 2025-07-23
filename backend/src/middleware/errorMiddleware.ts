// src/middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error caught by errorMiddleware:", err);

  const statusCode = err.status || err.statusCode || 500;

  const message = err.message || "An unexpected error occurred";

  res.status(statusCode).json({
    status: "error",
    message: message,
  });
};
