import { Router } from "express";
import { handleRedirect } from "../controllers/redirect.controller";

const router = Router();

router.get("/:shortCode", handleRedirect); // public redirect
router.get("/:shortCode", handleRedirect);

export default router;
