// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import {
  ForbiddenError,
  NotFoundError,
  InternalServerError,
  TokenExpiredError,
  InvalidTokenError,
} from "../utils/errors";

const prisma = new PrismaClient();

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
    return next(new ForbiddenError("No token provided"));
  }

  const token = authHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    return next(
      new InternalServerError("JWT secret is missing in server config")
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
      email: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return next(new NotFoundError("User"));
    }

    req.user = { id: user.id, email: user.email };
    next();
  } catch (error: any) {
    if (error instanceof JsonWebTokenError) {
      if (error.name === "TokenExpiredError") {
        return next(new TokenExpiredError());
      } else {
        return next(new InvalidTokenError());
      }
    }
    next(error);
  }
};
