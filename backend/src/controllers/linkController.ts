// src/controllers/linkController.ts
import { Request, Response, NextFunction } from "express";
import { LinkService } from "../services/linkService";
import { createShortLinkSchema, updateLinkSchema } from "../dtos/link.dto";
import { UnauthorizedError, InvalidInputError } from "../utils/errors";

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
      const validatedData = createShortLinkSchema.parse(req.body);
      const userId = req.user?.id;

      const newLink = await this.linkService.createShortLink(
        validatedData,
        userId
      );

      res.status(201).json({
        message: "Short link created successfully",
        data: newLink,
      });
    } catch (error: any) {
      next(error);
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
        throw new UnauthorizedError();
      }

      const validatedData = updateLinkSchema.parse(req.body);

      const id = parseInt(linkId, 10);
      if (isNaN(id)) {
        throw new InvalidInputError();
      }

      const updatedLink = await this.linkService.updateLink(
        id,
        userId,
        validatedData
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
        throw new UnauthorizedError();
      }

      const id = parseInt(linkId, 10);
      if (isNaN(id)) {
        throw new InvalidInputError();
      }

      await this.linkService.deleteLink(id, userId);

      res.status(200).json({ message: "Link deleted successfully" });
    } catch (error: any) {
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
        throw new UnauthorizedError();
      }

      const id = parseInt(linkId, 10);
      if (isNaN(id)) {
        throw new InvalidInputError();
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
      const originalUrl = await this.linkService.getOriginalUrl(shortCode, req);
      res.redirect(originalUrl);
    } catch (error: any) {
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
        throw new UnauthorizedError();
      }

      const userLinks = await this.linkService.getUserLinks(userId);

      res.status(200).json({
        message: "Links retrieved successfully",
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
        throw new UnauthorizedError();
      }

      const id = parseInt(linkId, 10);
      if (isNaN(id)) {
        throw new InvalidInputError();
      }

      const analyticsData = await this.linkService.getLinkAnalytics(id, userId);

      res.status(200).json({
        message: "Link analytics retrieved successfully",
        data: analyticsData,
      });
    } catch (error: any) {
      next(error);
    }
  };
}
