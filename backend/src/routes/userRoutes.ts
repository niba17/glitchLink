// src/routes/userRoutes.ts
import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const userController = new UserController();

router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/detail", authMiddleware, userController.detail);
router.delete("/delete", authMiddleware, userController.delete);

export default router;
