import geoip from "geoip-lite";

export function lookupGeoIP(ip: string) {
  const result = geoip.lookup(ip);
  if (!result) return null;

  return {
    country: result.country,
    region: result.region,
    city: result.city,
    latitude: result.ll?.[0],
    longitude: result.ll?.[1],
  };
}
