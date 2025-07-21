// src/routes/userRoutes.ts
import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();
const userController = new UserController();

// POST /api/users/register
router.post("/register", userController.register.bind(userController));

// --- NEW CODE ---

// POST /api/users/login
router.post("/login", userController.login.bind(userController));

export default router;
