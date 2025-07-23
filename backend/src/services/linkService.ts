// src/services/linkService.ts
import { LinkRepository } from "../repositories/linkRepository";
import { CreateLinkDto, UpdateLinkDto } from "../dtos/link.dto";
import { nanoid } from "nanoid";
import * as UAParser from "ua-parser-js";
import type { Link, Click } from "@prisma/client";
import qrcode from "qrcode";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  MissingJwtSecretError,
  CustomAliasAlreadyInUseError,
  LinkNotFoundError,
  LinkNotOwnedByUserError,
  CustomAliasTakenByAnotherLinkError,
  LinkExpiredError,
  LinkNotFoundOrExpiredError,
  QRCodeGenerationError,
  CannotGenerateQRCodeForExpiredLinkError,
} from "../utils/errors";

export class LinkService {
  private linkRepository: LinkRepository;
  private baseUrl: string;

  constructor() {
    this.linkRepository = new LinkRepository();
    if (!process.env.BASE_URL) {
      throw new MissingJwtSecretError(
        "Server configuration error: BASE_URL not defined."
      );
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
        throw new CustomAliasAlreadyInUseError();
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

    const expiresAtDate = expiresAt ? new Date(expiresAt) : null;

    try {
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
    } catch (error: any) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new CustomAliasAlreadyInUseError(
          "Generated short code or custom alias is already in use."
        );
      }
      throw error;
    }
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

    if (!link) {
      throw new LinkNotFoundError();
    }

    if (link.userId !== userId) {
      throw new LinkNotOwnedByUserError();
    }

    if (
      updateData.customAlias !== undefined &&
      updateData.customAlias !== null &&
      updateData.customAlias !== link.customAlias
    ) {
      const existingLinkWithAlias = await this.linkRepository.findByCustomAlias(
        updateData.customAlias
      );
      if (existingLinkWithAlias && existingLinkWithAlias.id !== linkId) {
        throw new CustomAliasTakenByAnotherLinkError();
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

    try {
      const updatedLink = await this.linkRepository.update(
        linkId,
        dataToUpdate
      );

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
    } catch (error: any) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new LinkNotFoundError();
      } else if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new CustomAliasTakenByAnotherLinkError();
      }
      throw error;
    }
  }

  async deleteLink(linkId: number, userId: number): Promise<void> {
    const link = await this.linkRepository.findById(linkId);

    if (!link) {
      throw new LinkNotFoundError();
    }

    if (link.userId !== userId) {
      throw new LinkNotOwnedByUserError();
    }

    try {
      await this.linkRepository.delete(linkId);
    } catch (error: any) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new LinkNotFoundError();
      }
      throw error;
    }
  }

  async generateQRCodeForLink(linkId: number, userId: number): Promise<string> {
    const link = await this.linkRepository.findById(linkId);

    if (!link) {
      throw new LinkNotFoundError();
    }

    if (link.userId !== userId) {
      throw new LinkNotOwnedByUserError();
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
      throw new CannotGenerateQRCodeForExpiredLinkError();
    }

    const fullShortUrl = `${this.baseUrl}/${link.shortCode}`;

    try {
      const qrCodeDataUrl = await qrcode.toDataURL(fullShortUrl);
      return qrCodeDataUrl;
    } catch (error: any) {
      throw new QRCodeGenerationError();
    }
  }

  public async getOriginalUrl(shortCode: string, req: any): Promise<string> {
    const link = await this.linkRepository.findByShortCode(shortCode);

    if (!link) {
      throw new LinkNotFoundOrExpiredError();
    }

    if (link.expiresAt && new Date() > link.expiresAt) {
      throw new LinkExpiredError();
    }

    console.log(
      `[LinkService] Link ditemukan: ID ${link.id}, Original: ${link.original}`
    );

    try {
      await this.linkRepository.incrementClicks(link.id);
    } catch (error: any) {}

    let browserName: string | null = null;
    let osName: string | null = null;

    const userAgent = req.headers["user-agent"];
    const ipAddress = req.ip;

    if (userAgent) {
      const parser = new UAParser.UAParser(userAgent);
      const browser = parser.getBrowser();
      const os = parser.getOS();
      browserName = browser.name || null;
      osName = os.name || null;
    }

    try {
      await this.linkRepository.createClick({
        linkId: link.id,
        ip: ipAddress,
        userAgent: userAgent,
        browser: browserName,
        os: osName,
      });
    } catch (error) {}

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
      throw new LinkNotFoundError();
    }

    if (link.userId !== userId) {
      throw new LinkNotOwnedByUserError();
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
