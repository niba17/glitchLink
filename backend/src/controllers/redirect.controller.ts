import { Request, Response } from "express";
import prisma from "../prisma/client";
import { lookupGeoIP } from "../utils/geoip";
import useragent from "useragent";

export const handleRedirect = async (req: Request, res: Response) => {
  const { shortCode } = req.params;

  try {
    const link = await prisma.link.findUnique({
      where: { shortCode },
    });

    if (!link) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    // Ambil IP dengan fallback
    const rawIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      req.ip;

    const cleanIp = rawIp?.replace(/^.*:/, "") || "unknown";

    // Ambil dan parse User-Agent
    const userAgentRaw = req.get("user-agent") || "";
    const agent = useragent.parse(userAgentRaw);

    const browser = agent.toAgent(); // Contoh: "Chrome 138.0.0.0"
    const os = agent.os.toString(); // Contoh: "Windows 10"

    // Geo IP lookup
    const geo = lookupGeoIP(cleanIp);

    // Simpan ke database
    await prisma.click.create({
      data: {
        linkId: link.id,
        ip: cleanIp,
        country: geo?.country ?? null,
        city: geo?.city ?? null,
        userAgent: userAgentRaw,
        browser,
        os,
      },
    });

    return res.redirect(link.original);
  } catch (err) {
    console.error("Redirect error:", err);
    return res
      .status(500)
      .json({ message: "Error during redirect", error: err });
  }
};
