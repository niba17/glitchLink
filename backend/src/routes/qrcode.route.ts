import express from "express";
import { getQRCode } from "../controllers/qrcode.controller";

const router = express.Router();

// GET /api/qrcode/:shortCode
router.get("/:shortCode", getQRCode);

export default router;
