/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import { Urgency } from "@/generated/prisma/enums";
import { injectCSS } from "@/lib/utils";
import { URGENCY_HEX, URGENCY_PRIORITY, URGENCY_GLOW } from "@/lib/constants";
import { MapCenter } from "@/hooks/useWilayahFilter";

export interface MapMarkerData {
  id: string;
  lat: number;
  lng: number;
  urgency: Urgency;
}

interface Props {
  reports: MapMarkerData[];
  selectedId: string | null;
  onSelect: (r: MapMarkerData) => void;
  centerOn?: MapCenter;
}

// ── Default: seluruh Indonesia ────────────────────────────────────────────────
const INDONESIA_CENTER = { lat: -1, lng: 118, zoom: 5 } as const;

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
  L: typeof import("leaflet"),
  cluster: any,
  markerUrgencyMap: globalThis.Map<string, Urgency>,
) {
  const count = cluster.getChildCount();
  const children: any[] = cluster.getAllChildMarkers();

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

  const size = count > 50 ? 48 : count > 10 ? 42 : 36;
  const fontSize = count > 99 ? 10 : count > 9 ? 12 : 13;

  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: ${size}px;
        height: ${size}px;
      ">
        <div style="
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: ${glow};
          animation: pulse-ring 2s ease-out infinite;
        "></div>
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

function getInitialZoom(): number {
  if (typeof window === "undefined") return INDONESIA_CENTER.zoom;
  return window.innerWidth <= 640 ? 4 : INDONESIA_CENTER.zoom;
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

function injectLocateButton(
  L: typeof import("leaflet"),
  map: import("leaflet").Map,
) {
  const id = "leaflet-locate-btn";
  if (document.getElementById(id)) return;

  // Custom Leaflet control — bottom-left
  const LocateControl = L.Control.extend({
    onAdd() {
      const btn = document.createElement("button");
      btn.id = id;
      btn.title = "Lokasi saya";
      btn.setAttribute("aria-label", "Pergi ke lokasi saya");
      btn.style.cssText = `
        width:36px;height:36px;border-radius:8px;
        background:white;border:2px solid rgba(0,0,0,0.2);
        cursor:pointer;display:flex;align-items:center;justify-content:center;
        box-shadow:0 1px 5px rgba(0,0,0,0.25);
        transition:background 0.15s;
      `;
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
          <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" fill="rgba(15,118,110,0.15)" stroke="none"/>
        </svg>`;

      // Hover
      btn.onmouseenter = () => {
        btn.style.background = "#f0fdf4";
      };
      btn.onmouseleave = () => {
        btn.style.background = "white";
      };

      btn.onclick = (e) => {
        e.stopPropagation();
        // Show loading state
        btn.style.opacity = "0.6";
        btn.style.cursor = "wait";

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            map.flyTo([pos.coords.latitude, pos.coords.longitude], 15, {
              duration: 1.0,
            });
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
          },
          () => {
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
            // Subtle shake animation to indicate failure
            btn.style.border = "2px solid #ef4444";
            setTimeout(() => {
              btn.style.border = "2px solid rgba(0,0,0,0.2)";
            }, 1500);
          },
          { timeout: 10_000, maximumAge: 30_000 },
        );
      };

      return btn;
    },
    onRemove() {
      document.getElementById(id)?.remove();
    },
  });

  new LocateControl({ position: "bottomleft" }).addTo(map);
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

  const markersRef = useRef<globalThis.Map<string, any>>(new globalThis.Map());
  const LRef = useRef<any>(null);
  const markerUrgencyMap = useRef<globalThis.Map<string, Urgency>>(
    new globalThis.Map(),
  );

  useEffect(() => {
    const el = containerRef.current;
    const currentMarkers = markersRef.current;

    if (!el) return;

    if ((el as any)._leaflet_id) delete (el as any)._leaflet_id;
    if (mapRef.current) return;

    let alive = true;
    const currentMarkerUrgencyMap = markerUrgencyMap.current;

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
          center: [INDONESIA_CENTER.lat, INDONESIA_CENTER.lng],
          zoom: getInitialZoom(),
          zoomControl: false,
          attributionControl: false,
          tapHold: false,
        });

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
          iconCreateFunction: (c: any) =>
            clusterIcon(L, c, markerUrgencyMap.current),
          animate: true,
          animateAddingMarkers: false,
          spiderfyOnMaxZoom: true,
          spiderfyDistanceMultiplier: 1.5,
        });

        mapRef.current = map;
        clusterRef.current = cluster;
        map.addLayer(cluster);

        injectLocateButton(L, map);

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
      currentMarkerUrgencyMap.clear();
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
    marker._urgency = r.urgency;
    marker.on("click", () => onSelect(r));
    cluster.addLayer(marker);
    markersRef.current.set(r.id, marker);
    markerUrgencyMap.current.set(r.id, r.urgency);
  }

  useEffect(() => {
    const L = LRef.current;
    const cluster = clusterRef.current;
    if (!L || !cluster) return;

    const current = new Set(reports.map((r) => r.id));

    markersRef.current.forEach((m: any, id: string) => {
      if (!current.has(id)) {
        cluster.removeLayer(m);
        markersRef.current.delete(id);
        markerUrgencyMap.current.delete(id);
      }
    });

    reports.forEach((r) => {
      if (!markersRef.current.has(r.id))
        addMarker(L, cluster, r, r.id === selectedId);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports]);

  useEffect(() => {
    const L = LRef.current;
    if (!L) return;

    // SOLUSI IMPLICIT ANY: Tambahkan tipe untuk callback marker dan id
    markersRef.current.forEach((marker: any, id: string) => {
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
          {
            duration: 0.5,
          },
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  useEffect(() => {
    if (!mapRef.current) return;

    if (centerOn) {
      mapRef.current.flyTo([centerOn.lat, centerOn.lng], centerOn.zoom, {
        duration: 0.9,
      });
    } else {
      mapRef.current.flyTo(
        [INDONESIA_CENTER.lat, INDONESIA_CENTER.lng],
        getInitialZoom(),
        { duration: 0.9 },
      );
    }
  }, [centerOn]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ touchAction: "pan-x pan-y" }}
    />
  );
}
