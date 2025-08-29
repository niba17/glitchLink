import { parseDevice } from "./deviceParser";
import { lookupGeo } from "./geoIp";
import { getClientIp } from "./getClientIp";
import type { ClickData } from "../types/click";

export function getClickDataFromRequest(req: any): ClickData {
  const userAgent = req.headers["user-agent"] || "";
  const ip = getClientIp(req) || "unknown"; // selalu string
  const { browser, os, device } = parseDevice(userAgent);
  const { city, country } = lookupGeo(ip);

  return {
    ip,
    userAgent,
    browser,
    os,
    device,
    city,
    country,
  };
}
