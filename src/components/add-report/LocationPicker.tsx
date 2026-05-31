/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { injectCSS } from "@/lib/utils";

interface LocationPickerProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
}

// ── Custom Modern Pin Icon ───────────────────────────────────────────────────
function pickerPinIcon(L: any) {
  const color = "oklch(0.511 0.096 186.391)"; // Menggunakan warna --primary
  return L.divIcon({
    html: `
      <svg width="36" height="46" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 4px 5px rgba(0,0,0,0.3));">
        <path d="M16 4 C9.37 4 4 9.37 4 16 c0 7.75 12 22 12 22 s12 -14.25 12 -22 C28 9.37 22.63 4 16 4 Z" fill="${color}" stroke="white" stroke-width="2.5" />
        <circle cx="16" cy="16" r="4.5" fill="white" />
      </svg>
    `,
    className: "",
    iconSize: [36, 46],
    iconAnchor: [18, 42],
  });
}

export function LocationPicker({
  lat,
  lng,
  onLocationChange,
}: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // ── Initialize Map ──────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if ((el as any)._leaflet_id) delete (el as any)._leaflet_id;
    if (mapRef.current) return;

    let alive = true;

    injectCSS(
      "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
      "leaflet-css",
    );

    import("leaflet").then((LeafletModule) => {
      if (!alive || !containerRef.current) return;

      const L = LeafletModule.default || LeafletModule;

      if ((containerRef.current as any)._leaflet_id) {
        delete (containerRef.current as any)._leaflet_id;
      }

      // 1. Buat Peta
      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Tile Layer OSM
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://openstreetmap.org">OSM</a>',
        maxZoom: 19,
      }).addTo(map);

      // 2. Buat Marker Draggable
      const marker = L.marker([lat, lng], {
        draggable: true,
        icon: pickerPinIcon(L),
      }).addTo(map);

      // 3. Event Listeners
      marker.on("dragend", (e: any) => {
        const position = e.target.getLatLng();
        onLocationChange(position.lat, position.lng);
      });

      map.on("click", (e: any) => {
        // Animasi halus saat marker pindah
        marker.setLatLng(e.latlng);
        map.flyTo(e.latlng, map.getZoom(), {
          animate: true,
          duration: 0.5,
        });
        onLocationChange(e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;
      markerRef.current = marker;
      setIsMapLoaded(true);
    });

    return () => {
      alive = false;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
      if (containerRef.current)
        delete (containerRef.current as any)._leaflet_id;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sync marker if props change externally ────────────────────────────────
  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      const currentPos = markerRef.current.getLatLng();
      if (
        Math.abs(currentPos.lat - lat) > 0.0001 ||
        Math.abs(currentPos.lng - lng) > 0.0001
      ) {
        markerRef.current.setLatLng([lat, lng]);
        mapRef.current.setView([lat, lng], mapRef.current.getZoom());
      }
    }
  }, [lat, lng]);

  const handleRecenter = () => {
    if (mapRef.current) {
      // Gunakan flyTo untuk efek smooth panning
      mapRef.current.flyTo([lat, lng], 17, { duration: 0.5 });
    }
  };

  const handleCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        },
      );

      const newLat = position.coords.latitude;
      const newLng = position.coords.longitude;

      onLocationChange(newLat, newLng);

      if (mapRef.current && markerRef.current) {
        markerRef.current.setLatLng([newLat, newLng]);
        mapRef.current.flyTo([newLat, newLng], 17, { duration: 0.8 });
      }
    } catch (error) {
      console.error("Failed to get current location:", error);
      alert(
        "Gagal mendapatkan lokasi saat ini. Pastikan GPS aktif dan izin lokasi diberikan pada browser Anda.",
      );
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        {/* Map Container */}
        <div
          ref={containerRef}
          className="w-full h-87.5 md:h-100 rounded-xl border border-border z-0 overflow-hidden"
        />

        {!isMapLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-muted/80 backdrop-blur-sm rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary" />
            <p className="text-sm font-medium text-foreground">
              Memuat peta...
            </p>
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex flex-row gap-2 z-400 items-end">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isLocating}
            onClick={handleCurrentLocation}
            className="shadow-lg bg-background/95 border-border hover:bg-primary hover:text-primary-foreground transition-all rounded-full px-3 pl-2"
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <Crosshair className="w-4 h-4 mr-1.5" />
            )}
            <span className="text-xs font-semibold">
              {isLocating ? "Mencari GPS..." : "Lokasi Saya"}
            </span>
          </Button>

          {/* Tombol Recenter Marker */}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleRecenter}
            className="shadow-lg bg-background/95 border-border hover:bg-primary hover:text-primary-foreground transition-all rounded-full px-3 pl-2"
          >
            <MapPin className="w-4 h-4 mr-1.5" />
            <span className="text-xs font-semibold">Ke Posisi Pin</span>
          </Button>
        </div>

        <div className="absolute top-3 left-3 bg-background/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-sm border border-border/50 z-400 pointer-events-none">
          <p className="text-[10px] font-mono font-semibold text-muted-foreground">
            {lat.toFixed(6)}, {lng.toFixed(6)}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3.5 bg-muted/40 rounded-xl border border-border/60">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <MapPin className="w-4 h-4 text-primary" />
        </div>
        <div className="text-sm">
          <p className="font-semibold text-foreground text-sm mb-1">
            Cara Menentukan Lokasi
          </p>
          <ul className="text-muted-foreground space-y-1 text-xs list-disc pl-4">
            <li>
              <strong>Sentuh/klik peta</strong> untuk memindahkan pin ke titik
              yang dituju.
            </li>
            <li>
              <strong>Seret pin</strong> merah untuk akurasi yang lebih presisi.
            </li>
            <li>
              Data kecamatan & alamat di bawah akan{" "}
              <strong>otomatis terisi</strong>.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
