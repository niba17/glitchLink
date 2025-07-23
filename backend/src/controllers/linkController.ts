// src/controllers/linkController.ts
import { Request, Response, NextFunction } from "express";
import { LinkService } from "../services/linkService";
import {
  createShortLinkSchema, // Mengganti createLinkSchema menjadi createShortLinkSchema
  updateLinkSchema,
  getLinkAnalyticsSchema,
} from "../dtos/link.dto";
import { ZodError } from "zod";

export class LinkController {
  private linkService: LinkService;

  constructor() {
    this.linkService = new LinkService();
  }

  createShortLink = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Pastikan validasi menggunakan createShortLinkSchema
      const validatedData = createShortLinkSchema.parse(req.body);
      const userId = req.user?.id; // userId bisa undefined jika middleware tidak diterapkan/user tidak login

      const newLink = await this.linkService.createShortLink(
        validatedData,
        userId
      );

      res.status(201).json({
        message: "Short link created successfully",
        data: newLink,
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Validation failed",
          errors: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
        return;
      } else if (
        error instanceof Error &&
        error.message === "Custom alias is already in use"
      ) {
        res.status(409).json({ message: error.message });
        return;
      }
      next(error); // Teruskan error yang tidak diketahui ke error handling middleware
    }
  };

  updateLink = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { linkId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res
          .status(401)
          .json({ message: "Unauthorized: User not authenticated." });
        return;
      }

      const validatedData = updateLinkSchema.parse(req.body);

      // Pastikan linkId adalah angka
      const id = parseInt(linkId, 10);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid Link ID." });
        return;
      }

      const updatedLink = await this.linkService.updateLink(
        id, // Ini parameter linkId
        userId, // Ini parameter userId
        validatedData // Ini parameter updateData
      );

      res.status(200).json({
        message: "Link updated successfully",
        data: {
          id: updatedLink.id,
          originalUrl: updatedLink.original,
          shortCode: updatedLink.shortCode,
          shortUrl: updatedLink.fullShortUrl,
          customAlias: updatedLink.customAlias,
          clicksCount: updatedLink.clicksCount,
          createdAt: updatedLink.createdAt,
          updatedAt: updatedLink.updatedAt,
          expiresAt: updatedLink.expiresAt,
        },
      });
    } catch (error: any) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: "Validation failed",
          errors: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        });
        return;
      } else if (
        error instanceof Error &&
        (error.message === "Link not found or not owned by user." ||
          error.message === "Custom alias already taken by another link.")
      ) {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  };

  deleteLink = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { linkId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res
          .status(401)
          .json({ message: "Unauthorized: User not authenticated." });
        return;
      }

      const id = parseInt(linkId, 10);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid Link ID." });
        return;
      }

      await this.linkService.deleteLink(id, userId);

      res.status(200).json({ message: "Link deleted successfully." });
    } catch (error: any) {
      if (
        error instanceof Error &&
        error.message === "Link not found or not owned by user."
      ) {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  };

  generateQRCode = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { linkId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res
          .status(401)
          .json({ message: "Unauthorized: User not authenticated." });
        return;
      }

      const id = parseInt(linkId, 10);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid Link ID." });
        return;
      }

      const qrCodeDataUrl = await this.linkService.generateQRCodeForLink(
        id,
        userId
      );

      res.status(200).json({
        message: "QR Code generated successfully",
        data: qrCodeDataUrl,
      });
    } catch (error: any) {
      if (
        error instanceof Error &&
        (error.message === "Link not found or not owned by user." ||
          error.message === "Cannot generate QR code for an expired link.")
      ) {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  };

  redirectToOriginalUrl = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { shortCode } = req.params;
      const originalUrl = await this.linkService.getOriginalUrl(
        shortCode,
        req // Meneruskan objek req agar LinkService bisa mendapatkan IP dan User-Agent
      );
      res.redirect(originalUrl);
    } catch (error: any) {
      if (
        error instanceof Error &&
        (error.message === "Link not found or expired." ||
          error.message === "Link has expired.")
      ) {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  };

  getUserLinks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res
          .status(401)
          .json({ message: "Unauthorized: User not authenticated." });
        return;
      }

      const userLinks = await this.linkService.getUserLinks(userId);

      res.status(200).json({
        message: "User links retrieved successfully",
        data: userLinks,
      });
    } catch (error) {
      next(error);
    }
  };

  getLinkAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { linkId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res
          .status(401)
          .json({ message: "Unauthorized: User not authenticated." });
        return;
      }

      const id = parseInt(linkId, 10);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid Link ID." });
        return;
      }

      const analyticsData = await this.linkService.getLinkAnalytics(id, userId);

      res.status(200).json({
        message: "Link analytics retrieved successfully",
        data: analyticsData,
      });
    } catch (error: any) {
      if (
        error instanceof Error &&
        (error.message === "Link not found." ||
          error.message === "Unauthorized: You do not own this link")
      ) {
        res.status(404).json({ message: error.message });
        return;
      }
      next(error);
    }
  };
}
