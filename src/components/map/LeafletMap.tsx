/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

/**
 * components/dashboard/LeafletMap.tsx
 *
 * - Leaflet map dengan Marker Cluster (leaflet.markercluster via CDN)
 * - Cluster otomatis merge saat zoom out, expand saat zoom in
 * - Strict Mode safe: isMounted guard + _leaflet_id cleanup
 * - centerOn prop: flyTo saat filter wilayah berubah
 */

import { useEffect, useRef } from "react";
import type { Report, Urgency } from "@/data/mock-reports";

const URGENCY_HEX: Record<Urgency, string> = {
  high: "#ef4444",
  medium: "#eab308",
  low: "#22c55e",
};

interface MapCenter {
  lat: number;
  lng: number;
  zoom: number;
}

interface Props {
  reports: Report[];
  selectedId: string | null;
  onSelect: (r: Report) => void;
  centerOn?: MapCenter;
}

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

// ── Inject external CSS once ───────────────────────────────────────────────────
function injectCSS(href: string, id: string) {
  if (document.getElementById(id)) return;
  const el = document.createElement("link");
  el.id = id;
  el.rel = "stylesheet";
  el.href = href;
  document.head.appendChild(el);
}

export default function LeafletMap({
  reports,
  selectedId,
  onSelect,
  centerOn,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const clusterRef = useRef<any>(null); // MarkerClusterGroup
  const markersRef = useRef<Map<string, any>>(new Map());
  const LRef = useRef<any>(null);

  // ── Init ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Strict Mode guard
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

    // Load Leaflet first, then the cluster plugin (needs L on window)
    import("leaflet").then((LeafletModule) => {
      if (!alive || !containerRef.current) return;

      const L = LeafletModule.default || LeafletModule;

      LRef.current = L;
      (window as any).L = L; // cluster plugin WAJIB baca raw object ini

      // Load cluster plugin dynamically
      const script = document.createElement("script");
      script.src =
        "https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js";

      script.onload = () => {
        if (!alive || !containerRef.current) return;
        if ((containerRef.current as any)._leaflet_id)
          delete (containerRef.current as any)._leaflet_id;

        const map = L.map(containerRef.current, {
          center: [-2.5, 118],
          zoom: 5,
          zoomControl: false,
          attributionControl: false,
        });

        L.control.zoom({ position: "topright" }).addTo(map);
        L.control
          .attribution({ position: "bottomleft", prefix: false })
          .addTo(map);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© <a href="https://openstreetmap.org">OSM</a>',
          maxZoom: 19,
        }).addTo(map);

        // MarkerClusterGroup — merge at zoom out, expand at zoom in
        const cluster = (L as any).markerClusterGroup({
          showCoverageOnHover: false,
          maxClusterRadius: 50,
          iconCreateFunction: (c: any) => {
            const count = c.getChildCount();
            const size = count > 50 ? 44 : count > 10 ? 38 : 32;
            return L.divIcon({
              html: `<div style="
                width:${size}px;height:${size}px;border-radius:50%;
                background:oklch(0.511 0.096 186.391);
                border:2.5px solid white;
                display:flex;align-items:center;justify-content:center;
                color:white;font-size:11px;font-weight:700;
                box-shadow:0 2px 8px rgba(0,0,0,0.25);">
                  ${count}
              </div>`,
              className: "",
              iconSize: [size, size],
            });
          },
        });

        mapRef.current = map;
        clusterRef.current = cluster;
        map.addLayer(cluster);

        // Add initial markers
        reports.forEach((r) => addMarker(L, cluster, r, r.id === selectedId));
      };
      document.head.appendChild(script);
    });

    return () => {
      alive = false;
      mapRef.current?.remove();
      mapRef.current = null;
      clusterRef.current = null;
      markersRef.current.clear();
      LRef.current = null;
      if (containerRef.current)
        delete (containerRef.current as any)._leaflet_id;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Helper: add a single marker to cluster ─────────────────────────────────
  function addMarker(L: any, cluster: any, r: Report, selected: boolean) {
    const marker = L.marker([r.lat, r.lng], {
      icon: pinIcon(L, URGENCY_HEX[r.urgency], selected),
    });
    marker.on("click", () => onSelect(r));
    cluster.addLayer(marker);
    markersRef.current.set(r.id, marker);
  }

  // ── Sync markers when reports change ───────────────────────────────────────
  useEffect(() => {
    const L = LRef.current;
    const cluster = clusterRef.current;
    if (!L || !cluster) return;

    const current = new Set(reports.map((r) => r.id));

    // Remove stale
    markersRef.current.forEach((m, id) => {
      if (!current.has(id)) {
        cluster.removeLayer(m);
        markersRef.current.delete(id);
      }
    });

    // Add new
    reports.forEach((r) => {
      if (!markersRef.current.has(r.id))
        addMarker(L, cluster, r, r.id === selectedId);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reports]);

  // ── Update selected marker icon ────────────────────────────────────────────
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

  // ── flyTo when filter changes ──────────────────────────────────────────────
  useEffect(() => {
    if (!centerOn || !mapRef.current) return;
    mapRef.current.flyTo([centerOn.lat, centerOn.lng], centerOn.zoom, {
      duration: 0.9,
    });
  }, [centerOn]);

  return <div ref={containerRef} className="w-full h-full" />;
}
