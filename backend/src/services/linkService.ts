// src/services/linkService.ts
import { LinkRepository } from "../repositories/linkRepository";
import { CreateLinkDto, UpdateLinkDto } from "../dtos/link.dto"; // Import createShortLinkSchema tidak diperlukan di sini
import { nanoid } from "nanoid";
import * as UAParser from "ua-parser-js";
import type { Link, Click } from "@prisma/client";
import qrcode from "qrcode";

export class LinkService {
  private linkRepository: LinkRepository;
  private baseUrl: string;

  constructor() {
    this.linkRepository = new LinkRepository();
    if (!process.env.BASE_URL) {
      throw new Error("BASE_URL is not defined in environment variables");
    }
    this.baseUrl = process.env.BASE_URL;
  }

  async createShortLink(
    linkData: CreateLinkDto,
    userId?: number
  ): Promise<{
    id: number;
    shortUrl: string;
    originalUrl: string;
    customAlias?: string | null;
    expiresAt?: Date | null;
    clicksCount: number;
  }> {
    const { originalUrl, customAlias, expiresAt } = linkData;
    let shortCodeToUse: string;

    const ownerId = userId;

    if (customAlias) {
      const existingLinkWithAlias = await this.linkRepository.findByCustomAlias(
        customAlias
      );
      if (existingLinkWithAlias) {
        throw new Error("Custom alias is already in use");
      }
      shortCodeToUse = customAlias;
    } else {
      let isUnique = false;
      let generatedCode = "";
      while (!isUnique) {
        generatedCode = nanoid(7);
        const existingLink = await this.linkRepository.findByShortCode(
          generatedCode
        );
        if (!existingLink) {
          isUnique = true;
        }
      }
      shortCodeToUse = generatedCode;
    }

    // Mengubah string expiresAt menjadi Date object atau null
    const expiresAtDate = expiresAt ? new Date(expiresAt) : null;

    const newLink = await this.linkRepository.create({
      original: originalUrl,
      shortCode: shortCodeToUse,
      customAlias: customAlias,
      userId: ownerId,
      expiresAt: expiresAtDate,
    });

    return {
      id: newLink.id,
      shortUrl: `${this.baseUrl}/${newLink.shortCode}`,
      originalUrl: newLink.original,
      customAlias: newLink.customAlias,
      expiresAt: newLink.expiresAt,
      clicksCount: newLink.clicksCount,
    };
  }

  async updateLink(
    linkId: number,
    userId: number,
    updateData: UpdateLinkDto
  ): Promise<
    Pick<
      Link,
      | "id"
      | "original"
      | "shortCode"
      | "customAlias"
      | "updatedAt"
      | "createdAt"
      | "expiresAt"
      | "userId"
      | "clicksCount"
    > & { fullShortUrl: string }
  > {
    const link = await this.linkRepository.findById(linkId);

    if (!link || link.userId !== userId) {
      throw new Error("Link not found or not owned by user.");
    }

    if (
      updateData.customAlias !== undefined &&
      updateData.customAlias !== null && // Cek jika bukan null
      updateData.customAlias !== link.customAlias
    ) {
      const existingLinkWithAlias = await this.linkRepository.findByCustomAlias(
        updateData.customAlias
      );
      if (existingLinkWithAlias && existingLinkWithAlias.id !== linkId) {
        throw new Error("Custom alias already taken by another link.");
      }
    }

    const dataToUpdate: {
      customAlias?: string | null;
      expiresAt?: Date | null;
    } = {};

    if (updateData.customAlias !== undefined) {
      dataToUpdate.customAlias = updateData.customAlias;
    }
    if (updateData.expiresAt !== undefined) {
      dataToUpdate.expiresAt =
        updateData.expiresAt === null ? null : new Date(updateData.expiresAt);
    }

    // Jika tidak ada data yang akan diupdate, kembalikan link yang sudah ada
    if (Object.keys(dataToUpdate).length === 0) {
      return {
        id: link.id,
        original: link.original,
        shortCode: link.shortCode,
        customAlias: link.customAlias,
        fullShortUrl: `${this.baseUrl}/${link.shortCode}`,
        updatedAt: link.updatedAt,
        createdAt: link.createdAt,
        clicksCount: link.clicksCount,
        expiresAt: link.expiresAt,
        userId: link.userId,
      };
    }

    const updatedLink = await this.linkRepository.update(linkId, dataToUpdate);

    return {
      id: updatedLink.id,
      original: updatedLink.original,
      shortCode: updatedLink.shortCode,
      customAlias: updatedLink.customAlias,
      fullShortUrl: `${this.baseUrl}/${updatedLink.shortCode}`,
      updatedAt: updatedLink.updatedAt,
      createdAt: updatedLink.createdAt,
      clicksCount: updatedLink.clicksCount,
      expiresAt: updatedLink.expiresAt,
      userId: updatedLink.userId,
    };
  }

  async deleteLink(linkId: number, userId: number): Promise<void> {
    const link = await this.linkRepository.findById(linkId);

    if (!link || link.userId !== userId) {
      throw new Error("Link not found or not owned by user.");
    }

    await this.linkRepository.delete(linkId);
  }

  async generateQRCodeForLink(linkId: number, userId: number): Promise<string> {
    const link = await this.linkRepository.findById(linkId);

    if (!link || link.userId !== userId) {
      throw new Error("Link not found or not owned by user.");
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
      throw new Error("Cannot generate QR code for an expired link.");
    }

    const fullShortUrl = `${this.baseUrl}/${link.shortCode}`;

    try {
      const qrCodeDataUrl = await qrcode.toDataURL(fullShortUrl);
      return qrCodeDataUrl;
    } catch (error: any) {
      throw new Error("Failed to generate QR code.");
    }
  }

  async getOriginalUrl(shortCode: string, req: any): Promise<string> {
    // req bisa dilewatkan sebagai Express.Request untuk akses yang lebih tipe-aman
    const link = await this.linkRepository.findByShortCode(shortCode);

    if (!link) {
      throw new Error("Link not found or expired."); // Ubah pesan agar konsisten dengan controller
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
      throw new Error("Link has expired.");
    }

    await this.linkRepository.incrementClicks(link.id);

    let browserName: string | null = null;
    let osName: string | null = null;

    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip; // Express's req.ip handles X-Forwarded-For if app.set('trust proxy') is used

    if (userAgent) {
      const parser = new UAParser.UAParser(userAgent);
      const browser = parser.getBrowser();
      const os = parser.getOS();
      browserName = browser.name || null;
      osName = os.name || null;
    }

    await this.linkRepository.createClick({
      linkId: link.id,
      ip: ipAddress,
      userAgent: userAgent,
      browser: browserName,
      os: osName,
      // country dan city tidak diisi jika tidak ada data geolokasi
    });

    return link.original;
  }

  async getUserLinks(userId: number): Promise<
    Array<{
      id: number;
      originalUrl: string;
      shortCode: string;
      shortUrl: string;
      customAlias?: string | null;
      clicksCount: number;
      createdAt: Date;
      updatedAt: Date | null;
      expiresAt?: Date | null;
    }>
  > {
    const userLinks = await this.linkRepository.getLinksByUserId(userId);

    return userLinks.map((link) => ({
      id: link.id,
      originalUrl: link.original,
      shortCode: link.shortCode,
      shortUrl: `${this.baseUrl}/${link.shortCode}`,
      customAlias: link.customAlias,
      clicksCount: link.clicksCount,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt,
      expiresAt: link.expiresAt,
    }));
  }

  async getLinkAnalytics(linkId: number, userId: number): Promise<any> {
    const link = await this.linkRepository.findById(linkId);

    if (!link) {
      throw new Error("Link not found.");
    }

    if (link.userId !== userId) {
      throw new Error("Unauthorized: You do not own this link");
    }

    const clicks = await this.linkRepository.getClicksByLinkId(linkId);

    const formattedClicks = clicks.map((click) => ({
      id: click.id,
      ip: click.ipAddress,
      country: click.country || null,
      city: click.city || null,
      userAgent: click.userAgent || null,
      browser: click.browser || null,
      os: click.os || null,
      timestamp: click.clickedAt,
    }));

    return {
      totalClicks: link.clicksCount,
      clicks: formattedClicks,
    };
  }
}
