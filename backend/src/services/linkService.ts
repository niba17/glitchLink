import { LinkRepository } from "../repositories/linkRepository";
import { CreateLinkDto, UpdateLinkDto } from "../DTOs/linkDTO";
import { nanoid } from "nanoid";
import * as UAParser from "ua-parser-js";
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
import type { Link } from "@prisma/client";
import { formatDateTime } from "../utils/date";
import { buildShortUrl } from "src/utils/buildShortUrl";

export class LinkService {
  private linkRepository: LinkRepository;
  private baseUrl: string;

  constructor() {
    this.linkRepository = new LinkRepository();
    this.baseUrl = process.env.BASE_URL as string;
  }

  async getUserLinks(userId: number) {
    const links = await this.linkRepository.getLinksByUserId(userId);
    return links.map((link) => ({
      ...link,
      shortUrl: buildShortUrl(this.baseUrl, link.shortCode),
      createdAt: formatDateTime(link.createdAt),
      updatedAt: formatDateTime(link.updatedAt),
      expiresAt: link.expiresAt ? formatDateTime(link.expiresAt) : null,
    }));
  }

  async createShortLink(linkData: CreateLinkDto, userId?: number) {
    const { originalUrl, customAlias, expiresAt } = linkData;

    const validationErrors: { path: string; message: string }[] = [];

    if (customAlias) {
      const existing = await this.linkRepository.findByCustomAlias(customAlias);
      if (existing) {
        throw new ConflictError("Conflict error", [
          {
            path: "customAlias",
            message: "Alias already in use",
          },
        ]);
      }
    }

    if (expiresAt) {
      const expiryDate = new Date(expiresAt);
      if (isNaN(expiryDate.getTime()) || expiryDate < new Date()) {
        validationErrors.push({
          path: "expiresAt",
          message: "Expiration date must be a valid future date",
        });
      }
    }

    if (validationErrors.length > 0) {
      throw new ValidationError(validationErrors);
    }

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
          {
            path: "customAlias",
            message: "Alias already in use",
          },
        ]);
      }
      throw error;
    }
  }

  async updateLink(linkId: number, userId: number, updateData: UpdateLinkDto) {
    const link = await this.getOwnedLinkOrThrow(linkId, userId);

    const updateFields: {
      customAlias?: string | null;
      shortCode?: string;
      expiresAt?: Date | null;
    } = {};

    // Jika customAlias berubah, validasi dan update juga shortCode
    if (updateData.customAlias && updateData.customAlias !== link.customAlias) {
      const existing = await this.linkRepository.findByCustomAlias(
        updateData.customAlias
      );
      if (existing && existing.id !== link.id) {
        throw new ConflictError("Conflict error", [
          {
            path: "customAlias",
            message: "Alias already in use",
          },
        ]);
      }
      updateFields.customAlias = updateData.customAlias;
      updateFields.shortCode = updateData.customAlias;
    } else if (updateData.customAlias === null) {
      updateFields.customAlias = null;
    }

    // Update tanggal expired jika disediakan
    if ("expiresAt" in updateData) {
      updateFields.expiresAt = updateData.expiresAt
        ? new Date(updateData.expiresAt)
        : null;
    }

    // Kalau tidak ada field yang diupdate, kembalikan link lama
    if (Object.keys(updateFields).length === 0) {
      return mapLinkToDto(link, this.baseUrl);
    }

    try {
      const updated = await this.linkRepository.update(link.id, updateFields);
      return mapLinkToDto(updated, this.baseUrl);
    } catch (error: any) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002")
          throw new ConflictError("Conflict error", [
            {
              path: "customAlias",
              message: "Alias already in use",
            },
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
      ) {
        throw new NotFoundError("Link");
      }
      throw error;
    }
  }

  async getLinkAnalytics(linkId: number, userId: number) {
    const link = await this.getOwnedLinkOrThrow(linkId, userId);
    const clicks = await this.linkRepository.getClicksByLinkId(linkId);

    return {
      totalClicks: link.clicksCount,
      clicks: clicks.map((click) => ({
        id: click.id,
        ip: click.ipAddress,
        country: click.country || null,
        city: click.city || null,
        userAgent: click.userAgent || null,
        browser: click.browser || null,
        os: click.os || null,
        timestamp: click.clickedAt,
      })),
    };
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

  async getOriginalUrl(shortCode: string, req: any): Promise<string> {
    const link = await this.linkRepository.findByShortCode(shortCode);
    if (!link) throw new ExpiredError("Link");
    if (link.expiresAt && new Date() > link.expiresAt) {
      throw new ExpiredError("Link");
    }

    try {
      await this.linkRepository.incrementClicks(link.id);
    } catch (_) {}

    const userAgent = req.headers["user-agent"];
    const ip = req.ip;

    let browser: string | null = null;
    let os: string | null = null;

    if (userAgent) {
      const parsed = new UAParser.UAParser(userAgent);
      browser = parsed.getBrowser().name || null;
      os = parsed.getOS().name || null;
    }

    try {
      await this.linkRepository.createClick({
        linkId: link.id,
        ip,
        userAgent,
        browser,
        os,
      });
    } catch (_) {}

    return link.original;
  }

  private async generateUniqueShortCode(): Promise<string> {
    while (true) {
      const code = nanoid(7);
      const exists = await this.linkRepository.findByShortCode(code);
      if (!exists) return code;
    }
  }

  private buildFullShortUrl(shortCode: string): string {
    return `${this.baseUrl}/${shortCode}`;
  }

  async generateQRCodeForLink(linkId: number, userId: number): Promise<string> {
    const link = await this.getOwnedLinkOrThrow(linkId, userId);
    if (link.expiresAt && new Date() > link.expiresAt) {
      throw new ExpiredError("Link");
    }

    try {
      return await qrcode.toDataURL(this.buildFullShortUrl(link.shortCode));
    } catch (error) {
      throw new InternalServerError();
    }
  }
}
