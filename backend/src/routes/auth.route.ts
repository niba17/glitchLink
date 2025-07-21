import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { registerSchema } from "../validators/register.schema";
import { register } from "../controllers/auth.controller";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);

export default router;
