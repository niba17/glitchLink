import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validateRequest(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      next(err); // ZodError akan tertangkap di errorHandler
    }
  };
}
