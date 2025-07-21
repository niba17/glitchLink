// src/routes/userRoutes.ts (contoh implementasi middleware)
import { Router } from "express";
import { UserController } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware"; // Import authMiddleware

const router = Router();
const userController = new UserController();

router.post("/register", userController.register.bind(userController));
router.post("/login", userController.login.bind(userController));

// Contoh rute yang dilindungi: GET /api/users/profile
// authMiddleware akan dieksekusi sebelum userController.getProfile
// router.get('/profile', authMiddleware, userController.getProfile.bind(userController));

export default router;
