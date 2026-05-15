"use client";

/**
 * hooks/useWilayahFilter.ts
 *
 * Mengelola state filter 2 level: Provinsi → Kabupaten/Kota menggunakan SWR.
 * - Map center: dari data/wilayah-coords.ts (bundled statis, instant)
 */

import { useState, useCallback } from "react";
import useSWR from "swr";
import { findProvinsi, findKabupaten } from "@/data/wilayahCoord";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MapCenter {
  lat: number;
  lng: number;
  zoom: number;
}

export interface WilayahItem {
  id: string;
  nama: string;
}

export interface WilayahFilterState {
  provinsiList: WilayahItem[];
  kabupatenList: WilayahItem[];
  selectedProvinsi: WilayahItem | null;
  selectedKabupaten: WilayahItem | null;
  loadingProvinsi: boolean;
  loadingKabupaten: boolean;
  errorProvinsi: string | null;
  errorKabupaten: string | null;
  mapCenter: MapCenter | null;
  selectProvinsi: (item: WilayahItem | null) => void;
  selectKabupaten: (item: WilayahItem | null) => void;
  reset: () => void;
}

// ─── Fetcher ──────────────────────────────────────────────────────────────────

const fetcher = async (path: string): Promise<WilayahItem[]> => {
  const res = await fetch(`/api/wilayah/${path}`);
  if (!res.ok) throw new Error(`Gagal memuat data (${res.status})`);
  const raw: { id: number | string; nama?: string; name?: string }[] = await res.json();
  return raw.map((r) => ({
    id: String(r.id),
    nama: r.nama ?? r.name ?? "",
  }));
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWilayahFilter(): WilayahFilterState {
  // Hanya simpan state untuk pilihan user dan center peta
  const [selectedProvinsi, setSelectedProvinsi] = useState<WilayahItem | null>(
    null,
  );
  const [selectedKabupaten, setSelectedKabupaten] =
    useState<WilayahItem | null>(null);
  const [mapCenter, setMapCenter] = useState<MapCenter | null>(null);

  // ── 1. Fetch Provinsi (Otomatis saat mount) ─────────────────────────────────
  const {
    data: provinsiList = [], // Default ke array kosong jika belum ada data
    isLoading: loadingProvinsi,
    error: errProvinsi,
  } = useSWR<WilayahItem[]>("provinsi.json", fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  // ── 2. Fetch Kabupaten (Dependent Fetching) ─────────────────────────────────
  // SWR otomatis tertahan (pause) jika key-nya null
  const {
    data: kabupatenData,
    isLoading: loadingKabupaten,
    error: errKabupaten,
  } = useSWR<WilayahItem[]>(
    selectedProvinsi ? `kabupaten/${selectedProvinsi.id}.json` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    },
  );

  // Jika selectedProvinsi null, set list ke array kosong, jika tidak gunakan data SWR
  const kabupatenList = selectedProvinsi ? kabupatenData || [] : [];

  // ── selectProvinsi ──────────────────────────────────────────────────────────
  const selectProvinsi = useCallback((item: WilayahItem | null) => {
    setSelectedProvinsi(item);
    setSelectedKabupaten(null); // Reset kabupaten saat provinsi berubah

    // Resolve map center instantly
    if (item) {
      const coord = findProvinsi(item.id) ?? findProvinsi(item.nama);
      setMapCenter(
        coord ? { lat: coord.lat, lng: coord.lng, zoom: coord.zoom } : null,
      );
    } else {
      setMapCenter(null); // Kembali ke overview Indonesia
    }
  }, []);

  // ── selectKabupaten ─────────────────────────────────────────────────────────
  const selectKabupaten = useCallback(
    (item: WilayahItem | null) => {
      setSelectedKabupaten(item);

      if (item) {
        // Zoom in ke kabupaten
        const coord = findKabupaten(item.id) ?? findKabupaten(item.nama);
        if (coord) {
          setMapCenter({ lat: coord.lat, lng: coord.lng, zoom: coord.zoom });
        } else if (selectedProvinsi) {
          // Fallback: zoom in sedikit dari center provinsi
          const pCoord = findProvinsi(selectedProvinsi.id);
          if (pCoord) {
            setMapCenter({
              lat: pCoord.lat,
              lng: pCoord.lng,
              zoom: pCoord.zoom + 2,
            });
          }
        }
      } else {
        // Kembali ke center provinsi jika kabupaten di-clear
        if (selectedProvinsi) {
          const coord = findProvinsi(selectedProvinsi.id);
          if (coord) {
            setMapCenter({ lat: coord.lat, lng: coord.lng, zoom: coord.zoom });
          }
        }
      }
    },
    [selectedProvinsi],
  );

  // ── reset ────────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setSelectedProvinsi(null);
    setSelectedKabupaten(null);
    setMapCenter(null);
  }, []);

  return {
    provinsiList,
    kabupatenList,
    selectedProvinsi,
    selectedKabupaten,
    loadingProvinsi,
    loadingKabupaten,
    errorProvinsi: errProvinsi?.message || null,
    errorKabupaten: errKabupaten?.message || null,
    mapCenter,
    selectProvinsi,
    selectKabupaten,
    reset,
  };
}
