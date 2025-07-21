// src/controllers/userController.ts
import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";
import { registerUserSchema, loginUserSchema } from "../dtos/user.dto"; // Import loginUserSchema
import { ZodError } from "zod";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validatedData = registerUserSchema.parse(req.body);

      const newUser = await this.userService.registerUser(validatedData);

      res.status(201).json({
        message: "User registered successfully",
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
  }

  // --- NEW CODE ---

  /**
   * Menangani permintaan login pengguna.
   * @param req Objek permintaan Express.
   * @param res Objek respons Express.
   * @param next Fungsi middleware berikutnya.
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Validasi input menggunakan Zod
      const validatedData = loginUserSchema.parse(req.body);

      // 2. Panggil service untuk logika bisnis login
      const { token, user } = await this.userService.loginUser(validatedData);

      // 3. Kirim respons sukses dengan token dan informasi pengguna
      res.status(200).json({
        message: "Login successful",
        token,
        user,
      });
    } catch (error: any) {
      // 4. Tangani error
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
        res.status(401).json({ message: error.message }); // 401 Unauthorized
        return;
      }
      // Serahkan error lain ke middleware penanganan error umum
      next(error);
    }
  }
}
