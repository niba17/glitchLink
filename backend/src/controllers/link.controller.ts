import { Request, Response } from "express";
import prisma from "../prisma/client";
import { nanoid } from "nanoid";
import { AuthenticatedRequest } from "middlewares/auth.middleware";

export const shortenUrl = async (req: Request, res: Response) => {
  const { original, customCode } = req.body;
  const userId = (req as any).user?.id;

  if (!original || typeof original !== "string") {
    return res.status(400).json({ message: "Invalid original URL" });
  }

  const prefix = "glitch-";
  const rawCode = customCode?.trim() || nanoid(6);
  const shortCode = `${prefix}${rawCode}`;

  const isValidShortCode = /^[a-zA-Z0-9_-]+$/.test(shortCode);
  if (!isValidShortCode) {
    return res.status(400).json({ message: "Invalid alias format" });
  }

  try {
    const existing = await prisma.link.findUnique({ where: { shortCode } });
    if (existing) {
      return res.status(409).json({ message: "Alias already in use" });
    }

    const newLink = await prisma.link.create({
      data: {
        original,
        shortCode,
        userId: userId ?? null,
      },
    });

    return res.status(201).json({
      message: "Short URL created",
      shortCode: newLink.shortCode,
      original: newLink.original,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create short URL", error });
  }
};

export const getUserLinks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const links = await prisma.link.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json({ links });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving links", error: err });
  }
};

export const getClicksByUser = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const links = await prisma.link.findMany({
    where: { userId },
    include: {
      clicks: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  res.json({ links });
};

export const updateLink = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  let { shortCode } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!shortCode || typeof shortCode !== "string") {
    return res.status(400).json({ message: "Alias required" });
  }

  // Pastikan alias selalu diawali dengan "glitch-"
  const prefix = "glitch-";
  if (!shortCode.startsWith(prefix)) {
    shortCode = prefix + shortCode;
  }

  try {
    const existing = await prisma.link.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: "Link not found" });
    }

    if (existing.userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (shortCode !== existing.shortCode) {
      const taken = await prisma.link.findUnique({ where: { shortCode } });
      if (taken) {
        return res.status(409).json({ message: "Alias already in use" });
      }
    }

    const updated = await prisma.link.update({
      where: { id },
      data: {
        shortCode,
        updatedAt: new Date(),
      },
    });

    return res.json({ message: "Alias updated", link: updated });
  } catch (err) {
    console.error("Update alias error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteLink = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const link = await prisma.link.findUnique({ where: { id } });

  if (!link || link.userId !== req.user.id) {
    return res.status(404).json({ message: "Link not found or Unauthorized" });
  }

  await prisma.link.delete({ where: { id } });

  res.json({ message: "Link deleted" });
};
