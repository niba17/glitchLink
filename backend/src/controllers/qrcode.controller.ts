// src/controllers/qrcode.controller.ts
import QRCode from "qrcode";
import { Request, Response } from "express";

export const getQRCode = async (req: Request, res: Response) => {
  const { shortCode } = req.params;
  const url = `https://glitch.link/${shortCode}`;

  try {
    res.setHeader("Content-Type", "image/png"); // penting!
    await QRCode.toFileStream(res, url, {
      type: "png",
      width: 300,
      margin: 1,
    });
    // jangan pakai res.json di sini
  } catch (err) {
    console.error("QR Error:", err);
    res.status(500).json({ message: "Gagal membuat QR Code" });
  }
};
