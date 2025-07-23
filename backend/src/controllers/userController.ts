// src/controllers/userController.ts
import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";
import { registerUserSchema, loginUserSchema } from "../dtos/user.dto";
import { ZodError } from "zod";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // Menggunakan fungsi panah untuk mempertahankan konteks 'this' secara otomatis
  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validatedData = registerUserSchema.parse(req.body);

      const newUser = await this.userService.registerUser(validatedData);

      res.status(201).json({
        message: "Register success",
        user: newUser,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Validation failed",
          errors: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
        return;
      } else if (
        error instanceof Error &&
        error.message === "User with this email already exists"
      ) {
        res.status(409).json({ message: error.message });
        return;
      }
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validatedData = loginUserSchema.parse(req.body);

      const { token, user } = await this.userService.loginUser(validatedData);

      res.status(200).json({
        message: "Login success",
        token,
        user,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Validation failed",
          errors: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
        return;
      } else if (
        error instanceof Error &&
        error.message === "Invalid credentials"
      ) {
        res.status(401).json({ message: error.message });
        return;
      }
      next(error);
    }
  };

  detail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user || !req.user.id) {
        res.status(401).json({ message: "Unauthorized: User data not found" });
        return;
      }

      const userId = req.user.id;

      const userDetail = await this.userService.getUserById(userId);

      if (!userDetail) {
        res.status(404).json({ message: "User not found." });
        return;
      }

      res.status(200).json({
        message: "Detail success",
        data: userDetail,
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized: User data not found" });
        return;
      }

      const userId = req.user.id;

      await this.userService.deleteUser(userId);

      res.status(200).json({
        message: "Deleted success",
      });
    } catch (error: any) {
      if (error instanceof Error && error.message === "User not found") {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  };
}
