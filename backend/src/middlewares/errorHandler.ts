import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { CustomError } from "../errors/CustomError";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("[Error]", err);

  // Handle Zod errors
  if (err instanceof ZodError) {
    const details = err.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: details,
    });
  }

  // Handle CustomError
  if (err instanceof CustomError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      errors: err.details ?? null,
    });
  }

  // Unhandled errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
