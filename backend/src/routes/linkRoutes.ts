// src/routes/linkRoutes.ts
import { Router } from "express";
import { LinkController } from "../controllers/linkController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const linkController = new LinkController();

// Auth required routes
router.post("/", authMiddleware, linkController.createShortLink);
router.put("/:linkId", authMiddleware, linkController.updateLink); // <-- Ganti :id menjadi :linkId
router.delete("/:linkId", authMiddleware, linkController.deleteLink); // <-- Ganti :id menjadi :linkId
router.get("/:linkId/qrcode", authMiddleware, linkController.generateQRCode); // <-- Ganti :id menjadi :linkId
router.get("/dashboard", authMiddleware, linkController.getUserLinks); // <-- Pastikan ini memanggil getUserLinks
router.get(
  "/:linkId/analytics",
  authMiddleware,
  linkController.getLinkAnalytics
); // <-- Ganti :id menjadi :linkId

// Public redirect route (no auth required)
router.get("/:shortCode", linkController.redirectToOriginalUrl); // <-- shortCode sudah benar

export default router;
