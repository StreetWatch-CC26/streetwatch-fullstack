"use client";

/**
 * app/dashboard/peta/page.tsx
 *
 * Halaman Peta Sebaran — menggunakan:
 *   - useWilayahFilter  → filter 2 level + mapCenter bundled
 *   - useUpvotes        → toggle dukungan laporan
 *   - WilayahFilterBar  → UI filter provinsi + kab/kota
 *   - LeafletMap        → peta + marker cluster (lazy, no SSR)
 *   - ReportPanel       → detail laporan (bottom sheet / card)
 *   - MapLegend         → keterangan warna urgensi
 */

import dynamic from "next/dynamic";
import { useState, useMemo } from "react";

import { MOCK_REPORTS, type Report } from "@/data/mock-reports";
import { useWilayahFilter } from "@/hooks/useWilayahFilter";
import { useUpvotes } from "@/hooks/useUpvotes";

import { WilayahFilterBar } from "@/components/map/WilayahFilterBar";
import { ReportPanel } from "@/components/map/ReportPanel";
import { MapLegend } from "@/components/map/MapLegend";

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

// Upvote counts dari mock data
const INITIAL_UPVOTES = Object.fromEntries(
  MOCK_REPORTS.map((r) => [r.id, r.upvotes]),
);

// ─────────────────────────────────────────────────────────────────────────────

export default function PetaPage() {
  const filter = useWilayahFilter();
  const upvotes = useUpvotes(INITIAL_UPVOTES);

  const [selected, setSelected] = useState<Report | null>(null);

  // ── Filter reports by active selection ───────────────────────────────────────
  const norm = (s: string) => s.toLowerCase().trim();

  const visibleReports = useMemo(() => {
    const { selectedProvinsi, selectedKabupaten } = filter;
    return MOCK_REPORTS.filter((r) => {
      if (selectedProvinsi && norm(r.provinsi) !== norm(selectedProvinsi.nama))
        return false;
      if (selectedKabupaten && norm(r.kota) !== norm(selectedKabupaten.nama))
        return false;
      return true;
    });
  }, [filter.selectedProvinsi, filter.selectedKabupaten]); // eslint-disable-line

  // ── Wrap filter actions to also clear detail panel ───────────────────────────
  const filterWithClear = useMemo(
    () => ({
      ...filter,
      selectProvinsi: (item: any) => {
        setSelected(null);
        filter.selectProvinsi(item);
      },
      selectKabupaten: (item: any) => {
        setSelected(null);
        filter.selectKabupaten(item);
      },
      reset: () => {
        setSelected(null);
        filter.reset();
      },
    }),
    [filter],
  );

  function handleVote(id: string) {
    upvotes.toggle(id);
    // refresh panel counter without closing it
    if (selected?.id === id) setSelected((p) => (p ? { ...p } : null));
  }

  const hasFilter = !!(filter.selectedProvinsi || filter.selectedKabupaten);

  // ── Stats ──────────────────────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      total: visibleReports.length,
      high: visibleReports.filter((r) => r.urgency === "high").length,
      medium: visibleReports.filter((r) => r.urgency === "medium").length,
      low: visibleReports.filter((r) => r.urgency === "low").length,
      // resolved: visibleReports.filter((r) => r.status === "resolved").length,
    }),
    [visibleReports],
  );

  return (
    <div className="flex flex-col mx-3 px-1 py-1 rounded-xs border border-border h-[calc(100dvh-156px)] sm:h-[calc(100dvh-65px)]">
      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-1 px-2 pt-1.5 pb-1.5 border-b border-border shrink-0">
        {/* Filter bar */}
        <WilayahFilterBar filter={filterWithClear} />

        {/* Stats + active breadcrumb */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          {/* Counts */}
          <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground tabular-nums">
                {stats.total}
              </span>
              {visibleReports.length !== MOCK_REPORTS.length && (
                <span>/{MOCK_REPORTS.length}</span>
              )}{" "}
              laporan
            </span>
            {stats.high > 0 && (
              <span className="flex items-center gap-1 text-red-500">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                {stats.high} tinggi
              </span>
            )}
            {stats.medium > 0 && (
              <span className="flex items-center gap-1 text-amber-500">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                {stats.medium} sedang
              </span>
            )}
            {stats.low > 0 && (
              <span className="flex items-center gap-1 text-green-500">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                {stats.low} rendah
              </span>
            )}
            {/* {stats.resolved > 0 && (
              <span className="text-green-600 dark:text-green-400">
                {stats.resolved} selesai
              </span>
            )} */}
          </div>

          {/* Active wilayah breadcrumb */}
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
      <div className="flex-1 relative min-h-0 overflow-hidden rounded-[2px]">
        <LeafletMap
          reports={visibleReports}
          selectedId={selected?.id ?? null}
          onSelect={setSelected}
          centerOn={filter.mapCenter ?? undefined}
        />

        {/* Legend — absolute, top-left */}
        <div className="absolute top-3 left-3 z-[400]">
          <MapLegend />
        </div>

        {/* Empty state */}
        {visibleReports.length === 0 && (
          <div className="absolute inset-0 z-[410] flex items-center justify-center pointer-events-none">
            <div className="bg-background/90 backdrop-blur-md border border-border rounded-2xl px-6 py-4 text-center shadow-lg">
              <p className="text-sm font-semibold text-foreground">
                Tidak ada laporan
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {hasFilter
                  ? "Belum ada laporan di wilayah ini."
                  : "Mulai dengan memilih wilayah di atas."}
              </p>
            </div>
          </div>
        )}

        {/* Report detail panel */}
        {selected && (
          <ReportPanel
            report={selected}
            upvotes={upvotes.getCount(selected.id)}
            hasVoted={upvotes.hasVoted(selected.id)}
            onVote={() => handleVote(selected.id)}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
}
