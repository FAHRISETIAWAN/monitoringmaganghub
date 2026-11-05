export type KoordinatStatus = "kosong" | "tidak-valid" | "luar-indonesia" | "valid";

export type KoordinatResult = {
  status: KoordinatStatus;
  latitude?: number;
  longitude?: number;
};

const INDONESIA = { latMin: -11.1, latMax: 6.3, lngMin: 94.9, lngMax: 141.1 };

export function sanitizeKoordinat(value: string): string {
  return value.replace(",", ".").replace(/[^0-9.-]/g, "");
}

export function cekKoordinat(latitude: string, longitude: string): KoordinatResult {
  if (!latitude.trim() || !longitude.trim()) return { status: "kosong" };

  const lat = Number(latitude);
  const lng = Number(longitude);
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return { status: "tidak-valid" };
  }

  const inIndonesia =
    lat >= INDONESIA.latMin &&
    lat <= INDONESIA.latMax &&
    lng >= INDONESIA.lngMin &&
    lng <= INDONESIA.lngMax;

  return {
    status: inIndonesia ? "valid" : "luar-indonesia",
    latitude: lat,
    longitude: lng,
  };
}

export function googleMapsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

export function osmEmbedUrl(latitude: number, longitude: number): string {
  const d = 0.004;
  const bbox = `${longitude - d},${latitude - d},${longitude + d},${latitude + d}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
}
