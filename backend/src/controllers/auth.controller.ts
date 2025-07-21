import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterDTO } from "../dtos/register.dto";

const authService = new AuthService();

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const dto = req.body as RegisterDTO;
    const result = await authService.register(dto);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
