import { LinkRepository } from "../repositories/linkRepository";
import { ClickService } from "./clickService";
import { CreateLinkDto, UpdateLinkDto } from "../DTOs/linkDTO";
import { nanoid } from "nanoid";
import qrcode from "qrcode";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  NotFoundError,
  ConflictError,
  ExpiredError,
  InternalServerError,
  ForbiddenError,
  ValidationError,
} from "../utils/errors";
import { mapLinkToDto } from "../mappers/linkMapper";
import type { Link, Click } from "@prisma/client";
import { getClickDataFromRequest } from "../utils/clickInfo";

export class LinkService {
  private linkRepository: LinkRepository;
  private clickService: ClickService;
  private baseUrl: string;

  constructor() {
    this.linkRepository = new LinkRepository();
    this.clickService = new ClickService(this.linkRepository);
    this.baseUrl = process.env.BASE_URL as string;
  }

  // ======================
  // Helper DRY
  // ======================
  private async validateCustomAlias(
    customAlias: string | undefined | null,
    linkId?: number
  ) {
    if (!customAlias) return; // jika null/undefined/empty, langsung return

    const existing = await this.linkRepository.findByCustomAlias(customAlias);
    if (existing && existing.id !== linkId) {
      throw new ConflictError("Conflict error", [
        { path: "customAlias", message: "Alias already in use" },
      ]);
    }
  }

  private mapClickToDto(click: Click) {
    return {
      id: click.id,
      ip: click.ipAddress,
      country: click.country || null,
      city: click.city || null,
      userAgent: click.userAgent || null,
      browser: click.browser || null,
      os: click.os || null,
      device: click.device || null,
      timestamp: click.clickedAt,
    };
  }

  private async generateUniqueShortCode(): Promise<string> {
    while (true) {
      const code = nanoid(7);
      const exists = await this.linkRepository.findByShortCode(code);
      if (!exists) return code;
    }
  }

  private async getOwnedLinkOrThrow(
    linkId: number,
    userId: number
  ): Promise<Link> {
    const link = await this.linkRepository.findById(linkId);
    if (!link) throw new NotFoundError("Link");
    if (link.userId !== userId)
      throw new ForbiddenError("You do not own this link");
    return link;
  }

  // ======================
  // CRUD & Core Logic
  // ======================
  async getUserLinks(userId: number) {
    const links = await this.linkRepository.getLinksByUserId(userId);
    return links.map((link) => mapLinkToDto(link, this.baseUrl));
  }

  async createShortLink(linkData: CreateLinkDto, userId?: number) {
    const { originalUrl, customAlias, expiresAt } = linkData;
    const validationErrors: { path: string; message: string }[] = [];

    if (expiresAt) {
      const expiryDate = new Date(expiresAt);
      if (isNaN(expiryDate.getTime()) || expiryDate < new Date()) {
        validationErrors.push({
          path: "expiresAt",
          message: "Expiration date must be a valid future date",
        });
      }
    }

    if (validationErrors.length > 0)
      throw new ValidationError(validationErrors);

    await this.validateCustomAlias(customAlias);

    const shortCode = customAlias || (await this.generateUniqueShortCode());

    try {
      const newLink = await this.linkRepository.create({
        original: originalUrl,
        shortCode,
        customAlias: customAlias || null,
        userId,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      });

      return mapLinkToDto(newLink, this.baseUrl);
    } catch (error: any) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictError("Conflict error", [
          { path: "customAlias", message: "Alias already in use" },
        ]);
      }
      throw error;
    }
  }

  async getAllLinkAnalytics(userId: number) {
    const links = await this.linkRepository.getLinksByUserId(userId);

    return Promise.all(
      links.map(async (link) => {
        const clicks = await this.linkRepository.getClicksByLinkId(link.id);
        return {
          ...mapLinkToDto(link, this.baseUrl),
          clicks: clicks.map(this.mapClickToDto),
        };
      })
    );
  }

  async updateLink(linkId: number, userId: number, updateData: UpdateLinkDto) {
    const link = await this.getOwnedLinkOrThrow(linkId, userId);
    const updateFields: {
      customAlias?: string | null;
      shortCode?: string;
      expiresAt?: Date | null;
    } = {};

    if ("customAlias" in updateData) {
      await this.validateCustomAlias(updateData.customAlias!, link.id);
      updateFields.customAlias = updateData.customAlias || null;
      updateFields.shortCode = updateData.customAlias || undefined;
    }

    if ("expiresAt" in updateData) {
      updateFields.expiresAt = updateData.expiresAt
        ? new Date(updateData.expiresAt)
        : null;
    }

    if (Object.keys(updateFields).length === 0)
      return mapLinkToDto(link, this.baseUrl);

    try {
      const updated = await this.linkRepository.update(link.id, updateFields);
      return mapLinkToDto(updated, this.baseUrl);
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002")
          throw new ConflictError("Conflict error", [
            { path: "customAlias", message: "Alias already in use" },
          ]);
        if (error.code === "P2025") throw new NotFoundError("Link");
      }
      throw error;
    }
  }

  async deleteLink(linkId: number, userId: number): Promise<void> {
    await this.getOwnedLinkOrThrow(linkId, userId);
    try {
      await this.linkRepository.delete(linkId);
    } catch (error: any) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        throw new NotFoundError("Link");
      throw error;
    }
  }

  async getLinkAnalytics(linkId: number, userId: number) {
    const link = await this.getOwnedLinkOrThrow(linkId, userId);
    const clicks = await this.linkRepository.getClicksByLinkId(linkId);

    return {
      ...mapLinkToDto(link, this.baseUrl),
      clicks: clicks.map(this.mapClickToDto),
    };
  }

  async getOriginalUrl(shortCode: string, req: any): Promise<string> {
    const link = await this.linkRepository.findByShortCode(shortCode);
    if (!link) throw new ExpiredError("Link");
    if (link.expiresAt && new Date() > link.expiresAt)
      throw new ExpiredError("Link");

    const clickData = getClickDataFromRequest(req);
    await this.clickService.recordClick(link.id, clickData);

    return link.original;
  }

  async generateQRCodeForLink(linkId: number, userId: number): Promise<string> {
    const link = await this.getOwnedLinkOrThrow(linkId, userId);
    if (link.expiresAt && new Date() > link.expiresAt)
      throw new ExpiredError("Link");

    try {
      return await qrcode.toDataURL(mapLinkToDto(link, this.baseUrl).shortUrl);
    } catch (error) {
      throw new InternalServerError();
    }
  }
}
