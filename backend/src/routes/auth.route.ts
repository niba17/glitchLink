// src/routes/auth.route.ts
import { Router } from "express";
import { register } from "../controllers/auth.controller";
import { login } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { getProfile } from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, getProfile);

export default router;
