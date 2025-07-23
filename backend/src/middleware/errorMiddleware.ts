// src/middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from "express";
import {
  CustomError,
  InternalServerError,
  ValidationError,
} from "../utils/errors";
import { ZodError } from "zod";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof ZodError) {
    const validationError = new ValidationError(
      undefined,
      err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }))
    );
    return res.status(validationError.statusCode).json({
      message: validationError.message,
      errors: validationError.issues,
    });
  }

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  const internalError = new InternalServerError();
  return res.status(internalError.statusCode).json({
    message: internalError.message,
  });
};
