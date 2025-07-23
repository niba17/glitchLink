// src/repositories/linkRepository.ts
import { PrismaClient, Link, Click } from "@prisma/client";

const prisma = new PrismaClient();

export class LinkRepository {
  async create(data: {
    original: string;
    shortCode: string;
    userId?: number;
    customAlias?: string | null;
    expiresAt?: Date | null;
  }): Promise<Link> {
    return prisma.link.create({
      data: {
        original: data.original,
        shortCode: data.shortCode,
        customAlias: data.customAlias,
        userId: data.userId,
        expiresAt: data.expiresAt,
        clicksCount: 0, // Inisialisasi clicksCount saat membuat link baru
      },
      select: {
        id: true,
        original: true,
        shortCode: true,
        customAlias: true,
        clicksCount: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true,
        userId: true,
      },
    });
  }

  async findByShortCode(shortCode: string): Promise<Link | null> {
    return prisma.link.findUnique({
      where: { shortCode: shortCode },
      select: {
        id: true,
        original: true,
        shortCode: true,
        customAlias: true,
        clicksCount: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true,
        userId: true,
      },
    });
  }

  async findByCustomAlias(customAlias: string): Promise<Link | null> {
    return prisma.link.findUnique({
      where: { customAlias: customAlias },
      select: {
        id: true,
        original: true,
        shortCode: true,
        customAlias: true,
        clicksCount: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true,
        userId: true,
      },
    });
  }

  async findById(linkId: number): Promise<Link | null> {
    try {
      const link = await prisma.link.findUnique({
        where: { id: linkId },
        select: {
          id: true,
          original: true,
          shortCode: true,
          customAlias: true,
          clicksCount: true,
          createdAt: true,
          updatedAt: true,
          expiresAt: true,
          userId: true,
        },
      });
      return link;
    } catch (error: any) {
      // Lebih baik menggunakan logger atau meneruskan error ke error handling middleware
      throw error;
    }
  }

  async incrementClicks(linkId: number): Promise<Link> {
    return prisma.link.update({
      where: { id: linkId },
      data: {
        clicksCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        original: true,
        shortCode: true,
        customAlias: true,
        clicksCount: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true,
        userId: true,
      },
    });
  }

  async createClick(data: {
    linkId: number;
    ip: string;
    userAgent?: string | null;
    browser?: string | null;
    os?: string | null;
    country?: string | null;
    city?: string | null;
  }): Promise<Click> {
    return prisma.click.create({
      data: {
        linkId: data.linkId,
        ipAddress: data.ip,
        userAgent: data.userAgent,
        browser: data.browser,
        os: data.os,
        country: data.country,
        city: data.city,
      },
    });
  }

  async getClicksByLinkId(linkId: number): Promise<Click[]> {
    try {
      const clicks = await prisma.click.findMany({
        where: { linkId: linkId },
        orderBy: { clickedAt: "desc" },
        select: {
          id: true,
          linkId: true,
          ipAddress: true,
          userAgent: true,
          browser: true,
          os: true,
          country: true,
          city: true,
          clickedAt: true,
        },
      });
      return clicks;
    } catch (error: any) {
      // Lebih baik menggunakan logger atau meneruskan error ke error handling middleware
      throw error;
    }
  }

  async getLinksByUserId(userId: number): Promise<Link[]> {
    return prisma.link.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        original: true,
        shortCode: true,
        customAlias: true,
        clicksCount: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true,
        userId: true,
      },
    });
  }

  async update(
    linkId: number,
    data: {
      customAlias?: string | null;
      expiresAt?: Date | null;
    }
  ): Promise<Link> {
    const updateData: { customAlias?: string | null; expiresAt?: Date | null } =
      {};
    if (data.customAlias !== undefined) {
      updateData.customAlias = data.customAlias;
    }
    if (data.expiresAt !== undefined) {
      updateData.expiresAt = data.expiresAt;
    }
    return prisma.link.update({
      where: { id: linkId },
      data: updateData,
      select: {
        id: true,
        original: true,
        shortCode: true,
        customAlias: true,
        clicksCount: true,
        createdAt: true,
        updatedAt: true,
        expiresAt: true,
        userId: true,
      },
    });
  }

  async delete(linkId: number): Promise<void> {
    await prisma.click.deleteMany({
      where: { linkId: linkId },
    });
    await prisma.link.delete({
      where: { id: linkId },
    });
  }
}
