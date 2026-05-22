"use client";
/**
 * app/dashboard/peta/page.tsx
 *
 * Halaman Peta Sebaran — menggunakan:
 *   - useWilayahFilter  → filter 2 level + mapCenter bundled
 *   - useUrgencyFilter  → filter berdasarkan urgency
 *   - useUpvotes        → toggle dukungan laporan
 *   - WilayahFilterBar  → UI filter provinsi + kab/kota
 *   - UrgencyFilterBar  → UI filter chip berdasarkan tingkat kerusakan
 *   - LeafletMap        → peta + marker cluster (lazy, no SSR)
 *   - ReportPanel       → detail laporan (bottom sheet / card)
 *   - MapLegend         → keterangan warna urgensi
 */

import dynamic from "next/dynamic";
import { useState, useMemo, useEffect } from "react";

import { useWilayahFilter, type WilayahItem } from "@/hooks/useWilayahFilter";
import { useUrgencyFilter } from "@/hooks/useUrgencyFilter";
import { useUpvotes } from "@/hooks/useUpvotes";

import { WilayahFilterBar } from "@/components/map/WilayahFilterBar";
import { UrgencyFilterBar } from "@/components/map/UrgencyFilterBar";
import { ReportPanel } from "@/components/map/ReportPanel";
import { MapLegend } from "@/components/map/MapLegend";
import { Loader2 } from "lucide-react";
import { Report } from "@/generated/prisma/client";

interface MapReport {
  id: string;
  lat: number;
  lng: number;
  urgency: "high" | "medium" | "low";
  upvoteCount: number;
  upvotes?: { id: string }[];
}

// Leaflet tidak boleh di-SSR
const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-muted/20">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <p className="text-xs text-muted-foreground">Memuat peta…</p>
    </div>
  ),
});

export default function MapPage() {
  const filter = useWilayahFilter();
  const upvotes = useUpvotes();

  const [reports, setReports] = useState<MapReport[]>([]);
  const [isLoadingMap, setIsLoadingMap] = useState(true);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<Report | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // ── Urgency filter (counts dihitung dari `reports` sebelum filter urgensi) ──
  const {
    activeFilters,
    filteredReports,
    counts,
    setFilter: setUrgencyFilter,
  } = useUrgencyFilter(reports);

  // ── 1. Fetch data marker peta ────────────────────────────────────────────────
  useEffect(() => {
    async function loadMapData() {
      setIsLoadingMap(true);
      try {
        const params = new URLSearchParams();
        if (filter.selectedProvinsi)
          params.append("provinsi", filter.selectedProvinsi.nama);
        if (filter.selectedKabupaten)
          params.append("kota", filter.selectedKabupaten.nama);

        const res = await fetch(`/api/reports/map?${params.toString()}`);
        const json = await res.json();

        if (json.success) {
          setReports(json.data);
          json.data.forEach((r: MapReport) => {
            const hasVoted = Boolean(r.upvotes && r.upvotes.length > 0);
            upvotes.sync(r.id, r.upvoteCount, hasVoted);
          });
        }
      } catch (err) {
        console.error("Gagal memuat data peta", err);
      } finally {
        setIsLoadingMap(false);
      }
    }
    loadMapData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.selectedProvinsi, filter.selectedKabupaten]);

  // ── 2. Fetch detail laporan saat marker diklik ───────────────────────────────
  useEffect(() => {
    let isActive = true;

    if (!selectedId) {
      queueMicrotask(() => {
        if (isActive) setSelectedDetail(null);
      });
      return () => {
        isActive = false;
      };
    }

    async function loadReportDetail() {
      setIsLoadingDetail(true);
      try {
        const res = await fetch(`/api/reports/${selectedId}`);
        const json = await res.json();

        if (json.success && isActive) {
          const detailData = json.data;
          detailData.imageUrl = detailData.imageUrls?.[0] || null;
          setSelectedDetail(detailData);

          const userHasVoted = Boolean(
            detailData.upvotes && detailData.upvotes.length > 0,
          );
          upvotes.sync(detailData.id, detailData.upvoteCount, userHasVoted);
        }
      } catch (err) {
        if (isActive) {
          console.error("Gagal memuat detail laporan", err);
        }
      } finally {
        if (isActive) {
          setIsLoadingDetail(false);
        }
      }
    }

    loadReportDetail();
    return () => {
      isActive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // ── Reset panel + urgency filter saat ganti wilayah ─────────────────────────
  const filterWithClear = useMemo(
    () => ({
      ...filter,
      selectProvinsi: (item: WilayahItem | null) => {
        setSelectedId(null);
        setUrgencyFilter(new Set());
        filter.selectProvinsi(item);
      },
      selectKabupaten: (item: WilayahItem | null) => {
        setSelectedId(null);
        setUrgencyFilter(new Set());
        filter.selectKabupaten(item);
      },
      reset: () => {
        setSelectedId(null);
        setUrgencyFilter(new Set());
        filter.reset();
      },
    }),
    [filter, setUrgencyFilter],
  );

  function handleVote(id: string) {
    upvotes.toggle(id);
  }

  const hasFilter = !!(filter.selectedProvinsi || filter.selectedKabupaten);

  return (
    <div className="flex flex-col mx-3 px-1 py-1 rounded-xs border border-border h-[calc(100dvh-144px)] sm:h-[calc(100dvh-65px)]">
      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-1 px-2 pt-1.5 pb-1.5 border-b border-border shrink-0">
        <WilayahFilterBar filter={filterWithClear} />

        {/* Urgency filter chips */}
        <UrgencyFilterBar
          activeFilters={activeFilters}
          counts={counts}
          onChange={setUrgencyFilter}
          className="my-1"
        />

        {/* Stats */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground tabular-nums">
                {filteredReports.length}
              </span>{" "}
              laporan kerusakan jalan ditemukan.
            </span>
          </div>

          {hasFilter && (
            <p className="text-[10px] text-muted-foreground truncate text-right min-w-0">
              {[filter.selectedKabupaten?.nama, filter.selectedProvinsi?.nama]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
      </div>

      {/* ── Map ── */}
      <div className="flex-1 relative min-h-0 overflow-hidden rounded-xs">
        {isLoadingMap ? (
          <div className="absolute inset-0 z-410 flex items-center justify-center bg-background/50 backdrop-blur-sm pointer-events-none">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-xs font-medium">
                Memuat data dari server...
              </span>
            </div>
          </div>
        ) : (
          <>
            <LeafletMap
              reports={filteredReports}
              selectedId={selectedId}
              onSelect={(r) => setSelectedId(r.id)}
              centerOn={filter.mapCenter ?? undefined}
            />

            <div className="absolute top-3 left-3 z-400">
              <MapLegend />
            </div>

            {filteredReports.length === 0 && (
              <div className="absolute inset-0 z-410 flex items-center justify-center pointer-events-none">
                <div className="bg-background/90 backdrop-blur-md border border-border rounded-2xl px-6 py-4 text-center shadow-lg">
                  <p className="text-sm font-semibold text-foreground">
                    Tidak ada laporan
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeFilters.size > 0
                      ? "Tidak ada laporan untuk tingkat kerusakan yang dipilih."
                      : hasFilter
                        ? "Belum ada jalan rusak yang diverifikasi di wilayah ini."
                        : "Mulai dengan memilih wilayah di atas."}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {selectedId && isLoadingDetail && (
          <div className="absolute z-460 bottom-4 right-4 w-80 bg-background border border-border p-4 rounded-2xl shadow-2xl flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="ml-2 text-sm">Mengambil detail laporan...</span>
          </div>
        )}

        {selectedId && !isLoadingDetail && selectedDetail && (
          <ReportPanel
            report={selectedDetail}
            upvotes={upvotes.getCount(selectedId)}
            hasVoted={upvotes.hasVoted(selectedId)}
            onVote={() => handleVote(selectedId)}
            onClose={() => setSelectedId(null)}
          />
        )}
      </div>
    </div>
  );
}
