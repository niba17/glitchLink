// src/routes/userRoutes.ts
import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import { loginUserSchema, registerUserSchema } from "../DTOs/userDTO";

const router = Router();
const userController = new UserController();

router.post(
  "/register",
  validateRequest(registerUserSchema),
  userController.register
);
router.post("/login", validateRequest(loginUserSchema), userController.login);

router.get("/detail", authMiddleware, userController.detail);
router.delete("/delete", authMiddleware, userController.delete);

export default router;
