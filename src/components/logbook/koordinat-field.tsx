"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  cekKoordinat,
  googleMapsUrl,
  osmEmbedUrl,
  sanitizeKoordinat,
} from "@/lib/koordinat";
import { cn } from "@/lib/utils";

export function KoordinatField({
  latitude,
  longitude,
  onChange,
}: {
  latitude: string;
  longitude: string;
  onChange: (latitude: string, longitude: string) => void;
}) {
  const [checked, setChecked] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const result = cekKoordinat(latitude, longitude);
  const canCheck = result.status !== "kosong";

  function handleUseMyLocation() {
    setLocationError("");
    if (!("geolocation" in navigator)) {
      setLocationError("Browser tidak mendukung deteksi lokasi.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange(
          position.coords.latitude.toFixed(6),
          position.coords.longitude.toFixed(6)
        );
        setChecked(true);
        setLocating(false);
      },
      (error) => {
        setLocating(false);
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? "Izin lokasi ditolak. Aktifkan izin lokasi di browser atau isi manual."
            : error.code === error.TIMEOUT
              ? "Waktu pencarian lokasi habis. Coba lagi."
              : "Lokasi tidak dapat ditentukan. Coba lagi atau isi manual."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  function handleLatitude(value: string) {
    setChecked(false);
    setLocationError("");
    onChange(sanitizeKoordinat(value), longitude);
  }

  function handleLongitude(value: string) {
    setChecked(false);
    setLocationError("");
    onChange(latitude, sanitizeKoordinat(value));
  }

  const showMap =
    checked &&
    result.latitude !== undefined &&
    result.longitude !== undefined &&
    (result.status === "valid" || result.status === "luar-indonesia");

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            inputMode="decimal"
            placeholder="-6.200000"
            value={latitude}
            onChange={(e) => handleLatitude(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            inputMode="decimal"
            placeholder="106.816666"
            value={longitude}
            onChange={(e) => handleLongitude(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={locating}
          onClick={handleUseMyLocation}
        >
          <Icon
            icon={locating ? "lucide:loader-circle" : "lucide:locate-fixed"}
            className={cn("size-4", locating && "animate-spin")}
          />
          {locating ? "Mencari lokasi..." : "Gunakan lokasi saya"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={!canCheck}
          onClick={() => setChecked(true)}
        >
          <Icon icon="lucide:map-pin-check" className="size-4" />
          Cek titik
        </Button>

        {checked && (
          <p
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium",
              result.status === "valid" && "text-up",
              result.status === "luar-indonesia" && "text-accent-yellow",
              result.status === "tidak-valid" && "text-down"
            )}
          >
            <Icon
              icon={
                result.status === "valid"
                  ? "lucide:circle-check"
                  : result.status === "luar-indonesia"
                    ? "lucide:triangle-alert"
                    : "lucide:circle-x"
              }
              className="size-4 shrink-0"
            />
            {result.status === "valid" && "Titik valid, berada di wilayah Indonesia."}
            {result.status === "luar-indonesia" &&
              "Titik valid tetapi berada di luar wilayah Indonesia. Periksa kembali."}
            {result.status === "tidak-valid" &&
              "Titik tidak valid. Latitude -90 s/d 90, longitude -180 s/d 180."}
          </p>
        )}
      </div>

      {locationError && (
        <p className="flex items-center gap-1.5 text-sm font-medium text-down">
          <Icon icon="lucide:circle-x" className="size-4 shrink-0" />
          {locationError}
        </p>
      )}

      {showMap && (
        <div className="flex flex-col gap-2">
          <iframe
            title="Pratinjau titik koordinat"
            src={osmEmbedUrl(result.latitude!, result.longitude!)}
            className="h-52 w-full rounded-xl border border-input"
            loading="lazy"
          />
          <a
            href={googleMapsUrl(result.latitude!, result.longitude!)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Buka di Google Maps
            <Icon icon="lucide:external-link" className="size-3" />
          </a>
        </div>
      )}
    </div>
  );
}
