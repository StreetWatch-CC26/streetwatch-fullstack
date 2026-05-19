/**
 * hooks/useUrgencyFilter.ts
 *
 * Hook untuk mengelola state filter urgensi pada halaman peta.
 *
 * Mengembalikan:
 * - `activeFilters` : Set<Urgency> yang sedang aktif (kosong = semua)
 * - `filteredReports`: laporan yang sudah difilter berdasarkan activeFilters
 * - `counts`        : jumlah laporan per level dari data SEBELUM filter urgensi
 *                     (agar count badge selalu akurat meski sebagian di-hide)
 * - `setFilter`     : setter langsung
 * - `reset`         : reset ke "semua"
 * - `isFiltered`    : true jika ada filter aktif (bukan "semua")
 */

import { useState, useMemo, useCallback } from "react";
import type { Urgency } from "@/generated/prisma/enums";
import type {
  UrgencyFilterState,
  UrgencyCounts,
} from "@/components/map/UrgencyFilterBar";

export interface UseUrgencyFilterReturn<T extends { urgency: Urgency }> {
  activeFilters: UrgencyFilterState;
  filteredReports: T[];
  counts: UrgencyCounts;
  setFilter: (next: UrgencyFilterState) => void;
  reset: () => void;
  isFiltered: boolean;
}

export function useUrgencyFilter<T extends { urgency: Urgency }>(
  reports: T[],
): UseUrgencyFilterReturn<T> {
  const [activeFilters, setActiveFilters] = useState<UrgencyFilterState>(
    new Set(),
  );

  // Count dihitung dari `reports` SEBELUM filter urgensi diterapkan
  // sehingga badge count tetap akurat meski level tertentu di-hide
  const counts = useMemo<UrgencyCounts>(
    () => ({
      high: reports.filter((r) => r.urgency === "high").length,
      medium: reports.filter((r) => r.urgency === "medium").length,
      low: reports.filter((r) => r.urgency === "low").length,
    }),
    [reports],
  );

  // Set kosong berarti "semua aktif"
  const isFiltered = activeFilters.size > 0;

  const filteredReports = useMemo(
    () =>
      isFiltered
        ? reports.filter((r) => activeFilters.has(r.urgency))
        : reports,
    [reports, activeFilters, isFiltered],
  );

  const setFilter = useCallback((next: UrgencyFilterState) => {
    setActiveFilters(next);
  }, []);

  const reset = useCallback(() => {
    setActiveFilters(new Set());
  }, []);

  return {
    activeFilters,
    filteredReports,
    counts,
    setFilter,
    reset,
    isFiltered,
  };
}
