// src/routes/linkRoutes.ts
import { Router } from "express";
import { LinkController } from "../controllers/linkController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { optionalAuthMiddleware } from "../middlewares/optionalAuthMiddleware";

const router = Router();
const linkController = new LinkController();

router.post("/", optionalAuthMiddleware, linkController.createShortLink);

router.put("/:linkId", authMiddleware, linkController.updateLink);
router.get("/:linkId/qrcode", authMiddleware, linkController.generateQRCode);
router.get("/dashboard", authMiddleware, linkController.getUserLinks);
router.get(
  "/:linkId/analytics",
  authMiddleware,
  linkController.getLinkAnalytics
);
router.delete("/:linkId", authMiddleware, linkController.deleteLink);

router.get("/:shortCode", linkController.redirectToOriginalUrl);

export default router;
