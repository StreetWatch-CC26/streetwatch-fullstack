/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Urgency } from "@/generated/prisma/enums";
import { useEffect, useRef } from "react";

export interface MapMarkerData {
  id: string;
  lat: number;
  lng: number;
  urgency: Urgency;
}

const URGENCY_HEX: Record<Urgency, string> = {
  high: "#ef4444",
  medium: "#eab308",
  low: "#22c55e",
};

/**
 * Urutan prioritas: high > medium > low
 * Cluster mengambil warna urgency tertinggi dari child-nya.
 */
const URGENCY_PRIORITY: Record<Urgency, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

/** Warna ring/glow per urgency untuk cluster aktif */
const URGENCY_GLOW: Record<Urgency, string> = {
  high: "rgba(239,68,68,0.35)",
  medium: "rgba(234,179,8,0.35)",
  low: "rgba(34,197,94,0.35)",
};

interface MapCenter {
  lat: number;
  lng: number;
  zoom: number;
}

interface Props {
  reports: MapMarkerData[];
  selectedId: string | null;
  onSelect: (r: MapMarkerData) => void;
  centerOn?: MapCenter;
}

// ── Default: seluruh Indonesia ────────────────────────────────────────────────
const INDONESIA_CENTER = { lat: -2.5, lng: 118, zoom: 5 };

// ── Icon factory ───────────────────────────────────────────────────────────────
function pinIcon(L: any, color: string, selected: boolean) {
  const width = selected ? 40 : 32;
  const height = selected ? 52 : 42;
  const anchorY = height * (38 / 42);

  return L.divIcon({
    html: `
      <svg 
        width="${width}" 
        height="${height}" 
        viewBox="0 0 32 42" 
        xmlns="http://www.w3.org/2000/svg"
        style="filter: drop-shadow(0px 4px 5px rgba(0,0,0,0.3));"
      >
        ${
          selected
            ? `<circle cx="16" cy="16" r="14" fill="${color}" opacity="0.3" />`
            : ""
        }
        <path 
          d="M16 4 C9.37 4 4 9.37 4 16 c0 7.75 12 22 12 22 s12 -14.25 12 -22 C28 9.37 22.63 4 16 4 Z" 
          fill="${color}" 
          stroke="white" 
          stroke-width="2.5" 
        />
        <circle cx="16" cy="16" r="4.5" fill="white" />
      </svg>
    `,
    className: "",
    iconSize: [width, height],
    iconAnchor: [width / 2, anchorY],
  });
}

/**
 * Buat cluster icon dengan warna dominan berdasarkan urgency tertinggi
 * di antara semua child marker dalam cluster.
 */
function clusterIcon(
  L: any,
  cluster: any,
  markerUrgencyMap: Map<string, Urgency>,
) {
  const count = cluster.getChildCount();
  const children: any[] = cluster.getAllChildMarkers();

  // Tentukan urgency dominan dari child markers
  let dominantUrgency: Urgency = "low";
  let highestPriority = 0;

  children.forEach((marker: any) => {
    const urgency = marker._urgency as Urgency | undefined;
    if (urgency) {
      const priority = URGENCY_PRIORITY[urgency];
      if (priority > highestPriority) {
        highestPriority = priority;
        dominantUrgency = urgency;
      }
    }
  });

  const color = URGENCY_HEX[dominantUrgency];
  const glow = URGENCY_GLOW[dominantUrgency];

  // Ukuran responsif: lebih besar untuk touch
  const size = count > 50 ? 48 : count > 10 ? 42 : 36;
  const fontSize = count > 99 ? 10 : count > 9 ? 12 : 13;

  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
      ">
        <!-- Outer glow ring -->
        <div style="
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: ${glow};
          animation: pulse-ring 2s ease-out infinite;
        "></div>
        <!-- Main circle -->
        <div style="
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: ${color};
          border: 2.5px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: ${fontSize}px;
          font-weight: 700;
          font-family: ui-monospace, monospace;
          box-shadow: 0 2px 10px rgba(0,0,0,0.25);
          letter-spacing: -0.5px;
        ">
          ${count > 99 ? "99+" : count}
        </div>
      </div>
    `,
    className: "leaflet-cluster-urgency",
    iconSize: [size + 8, size + 8],
    iconAnchor: [(size + 8) / 2, (size + 8) / 2],
  });
}

function injectCSS(href: string, id: string) {
  if (document.getElementById(id)) return;
  const el = document.createElement("link");
  el.id = id;
  el.rel = "stylesheet";
  el.href = href;
  document.head.appendChild(el);
}

function injectPulseKeyframe() {
  const id = "cluster-pulse-style";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
    @keyframes pulse-ring {
      0%   { transform: scale(0.9); opacity: 0.7; }
      70%  { transform: scale(1.3); opacity: 0; }
      100% { transform: scale(1.3); opacity: 0; }
    }
    .leaflet-cluster-urgency {
      background: transparent !important;
      border: none !important;
    }
  `;
  document.head.appendChild(style);
}

export default function LeafletMap({
  reports,
  selectedId,
  onSelect,
  centerOn,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const clusterRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const LRef = useRef<any>(null);
  /** Cache urgency per marker id untuk cluster color logic */
  const markerUrgencyMap = useRef<Map<string, Urgency>>(new Map());

  // 1. Inisialisasi Peta
  useEffect(() => {
    const el = containerRef.current;
    const currentMarkers = markersRef.current;

    if (!el) return;

    if ((el as any)._leaflet_id) delete (el as any)._leaflet_id;
    if (mapRef.current) return;

    let alive = true;

    injectCSS(
      "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
      "leaflet-css",
    );
    injectCSS(
      "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css",
      "mc-css",
    );
    injectCSS(
      "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css",
      "mc-default-css",
    );
    injectPulseKeyframe();

    import("leaflet").then((LeafletModule) => {
      if (!alive || !containerRef.current) return;

      const L = LeafletModule.default || LeafletModule;
      LRef.current = L;
      (window as any).L = L;

      const script = document.createElement("script");
      script.src =
        "https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js";

      script.onload = () => {
        if (!alive || !containerRef.current) return;
        if ((containerRef.current as any)._leaflet_id)
          delete (containerRef.current as any)._leaflet_id;

        const map = L.map(containerRef.current, {
          // Default: tampilan seluruh Indonesia
          center: [INDONESIA_CENTER.lat, INDONESIA_CENTER.lng],
          zoom: INDONESIA_CENTER.zoom,
          zoomControl: false,
          attributionControl: false,
        });

        // Zoom control → kanan atas, lebih jauh dari edge agar tidak nabrak notch
        L.control.zoom({ position: "topright" }).addTo(map);
        L.control
          .attribution({ position: "bottomleft", prefix: false })
          .addTo(map);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© <a href="https://openstreetmap.org">OSM</a>',
          maxZoom: 19,
        }).addTo(map);

        const cluster = (L as any).markerClusterGroup({
          showCoverageOnHover: false,
          maxClusterRadius: 50,
          // Gunakan urgency-aware cluster icon
          iconCreateFunction: (c: any) =>
            clusterIcon(L, c, markerUrgencyMap.current),
          // Tap-friendly: animasi lebih cepat di mobile
          animate: true,
          animateAddingMarkers: false,
          spiderfyOnMaxZoom: true,
          // Jarak spiderfy lebih besar untuk touch
          spiderfyDistanceMultiplier: 1.5,
        });

        mapRef.current = map;
        clusterRef.current = cluster;
        map.addLayer(cluster);

        reports.forEach((r) => addMarker(L, cluster, r, r.id === selectedId));
      };
      document.head.appendChild(script);
    });

    return () => {
      alive = false;
      mapRef.current?.remove();
      mapRef.current = null;
      clusterRef.current = null;
      currentMarkers.clear();
      markerUrgencyMap.current.clear();
      LRef.current = null;
      if (el) delete (el as any)._leaflet_id;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addMarker(
    L: any,
    cluster: any,
    r: MapMarkerData,
    selected: boolean,
  ) {
    const marker = L.marker([r.lat, r.lng], {
      icon: pinIcon(L, URGENCY_HEX[r.urgency], selected),
    });
    // Simpan urgency di marker object agar bisa dibaca iconCreateFunction
    marker._urgency = r.urgency;
    marker.on("click", () => onSelect(r));
    cluster.addLayer(marker);
    markersRef.current.set(r.id, marker);
    markerUrgencyMap.current.set(r.id, r.urgency);
  }

  // 2. Sinkronisasi Marker saat data "reports" berubah
  useEffect(() => {
    const L = LRef.current;
    const cluster = clusterRef.current;
    if (!L || !cluster) return;

    const current = new Set(reports.map((r) => r.id));

    // Hapus marker yang tidak ada di data terbaru
    markersRef.current.forEach((m, id) => {
      if (!current.has(id)) {
        cluster.removeLayer(m);
        markersRef.current.delete(id);
        markerUrgencyMap.current.delete(id);
      }
    });

    // Tambah marker baru
    reports.forEach((r) => {
      if (!markersRef.current.has(r.id))
        addMarker(L, cluster, r, r.id === selectedId);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports]);

  // 3. Update icon selected
  useEffect(() => {
    const L = LRef.current;
    if (!L) return;
    markersRef.current.forEach((marker, id) => {
      const r = reports.find((x) => x.id === id);
      if (!r) return;
      marker.setIcon(pinIcon(L, URGENCY_HEX[r.urgency], id === selectedId));
    });

    if (selectedId) {
      const r = reports.find((x) => x.id === selectedId);
      if (r && mapRef.current)
        mapRef.current.flyTo(
          [r.lat, r.lng],
          Math.max(mapRef.current.getZoom(), 15),
          { duration: 0.5 },
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // 4. Center Map saat dropdown wilayah berubah
  useEffect(() => {
    if (!mapRef.current) return;

    if (centerOn) {
      mapRef.current.flyTo([centerOn.lat, centerOn.lng], centerOn.zoom, {
        duration: 0.9,
      });
    } else {
      // Reset ke Indonesia jika filter wilayah di-clear
      mapRef.current.flyTo(
        [INDONESIA_CENTER.lat, INDONESIA_CENTER.lng],
        INDONESIA_CENTER.zoom,
        { duration: 0.9 },
      );
    }
  }, [centerOn]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      // Hint browser untuk optimasi touch rendering
      style={{ touchAction: "pan-x pan-y" }}
    />
  );
}
