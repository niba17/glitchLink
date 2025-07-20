import { Router } from "express";
import { shortenUrl } from "../controllers/link.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { getUserLinks } from "../controllers/link.controller";
import { getClicksByUser } from "../controllers/link.controller";
import { updateLink } from "../controllers/link.controller";
import { deleteLink } from "../controllers/link.controller";
import { optionalAuth } from "../middlewares/optionalAuth.middleware";

const router = Router();

router.post("/shorten", optionalAuth, shortenUrl); // hanya bisa oleh user login
router.get("/", authenticate, getUserLinks);
router.get("/analytics", authenticate, getClicksByUser);
router.put("/:id", authenticate, updateLink);
router.delete("/links/:id", authenticate, deleteLink);

export default router;
