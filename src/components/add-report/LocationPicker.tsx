/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationPickerProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
}

// ── Inject external CSS once ───────────────────────────────────────────────────
function injectCSS(href: string, id: string) {
  if (document.getElementById(id)) return;
  const el = document.createElement("link");
  el.id = id;
  el.rel = "stylesheet";
  el.href = href;
  document.head.appendChild(el);
}

// ── Custom Modern Pin Icon ───────────────────────────────────────────────────
function pickerPinIcon(L: any) {
  // Pin warna primer (biru) untuk picker
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

  // ── Initialize Map ──────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Strict Mode cleanup
    if ((el as any)._leaflet_id) delete (el as any)._leaflet_id;
    if (mapRef.current) return;

    let alive = true;

    // Inject CSS Leaflet
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
        zoomControl: false, // Kita pindahkan ke kanan bawah atau hapus
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
      // Saat marker selesai ditarik
      marker.on("dragend", (e: any) => {
        const position = e.target.getLatLng();
        onLocationChange(position.lat, position.lng);
      });

      // Saat peta diklik
      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng);
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
      // Hanya set ulang jika perubahannya signifikan (mencegah infinite loop)
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
      mapRef.current.setView([lat, lng], 17);
    }
  };

  const handleCurrentLocation = async () => {
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
        mapRef.current.flyTo([newLat, newLng], 17, { duration: 0.5 });
      }
    } catch (error) {
      console.error("Failed to get current location:", error);
      alert(
        "Gagal mendapatkan lokasi saat ini. Pastikan GPS aktif dan izin lokasi diberikan.",
      );
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        {/* Map Container */}
        <div
          ref={containerRef}
          className="w-full h-[350px] md:h-[400px] rounded-lg border border-border z-0"
        />

        {/* Loading Overlay */}
        {!isMapLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/80 backdrop-blur-sm rounded-lg">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Memuat peta OSM...</p>
            </div>
          </div>
        )}

        {/* Custom Controls (Berada di atas peta) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-[400]">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={handleCurrentLocation}
            className="shadow-lg hover:bg-primary hover:text-primary-foreground transition-colors"
            title="Gunakan lokasi saat ini"
          >
            <Crosshair className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={handleRecenter}
            className="shadow-lg hover:bg-primary hover:text-primary-foreground transition-colors"
            title="Pusatkan ke marker"
          >
            <MapPin className="w-4 h-4" />
          </Button>
        </div>

        {/* Coordinates Display */}
        <div className="absolute bottom-3 left-3 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-md shadow border border-border z-[400] pointer-events-none">
          <p className="text-[11px] font-mono font-medium text-foreground">
            {lat.toFixed(6)}, {lng.toFixed(6)}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
        <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-foreground mb-1 text-xs">
            Instruksi Peta:
          </p>
          <ul className="text-muted-foreground space-y-0.5 text-xs">
            <li>
              • <strong>Sentuh peta</strong> untuk memindahkan pin lokasi
            </li>
            <li>
              • <strong>Seret (Drag) pin</strong> untuk penyesuaian akurat
            </li>
            <li>
              • Data wilayah (Kecamatan/Kelurahan) akan otomatis diperbarui
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
