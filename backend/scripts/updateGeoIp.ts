import geoip from "geoip-lite";

(geoip as any).update((err: Error | null) => {
  if (err) {
    console.error("GeoIP Update failed:", err);
  } else {
    console.log("GeoIP database successfully updated.");
  }
});
