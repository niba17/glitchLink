import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { CustomError } from "../utils/errors";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        // status: "error",
        path: issue.path.join("."), // biasanya string key
        message: issue.message,
      })),
    });
  }

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(err.meta?.errors
        ? { errors: err.meta.errors }
        : err.meta
        ? { errors: err.meta }
        : {}),
    });
  }

  console.error("[Internal Error]", err);

  // default error
  return res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
}
