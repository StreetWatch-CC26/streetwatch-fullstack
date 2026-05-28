// src/app/dashboard/reports/page.tsx
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Loader2,
  Image as ImageIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  // FileDown,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { ReportPost } from "@/components/reports/ReportPost";
// import { ExportDialog } from "@/components/reports/ExportDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  calcPriorityScore,
  getPriorityTier,
  sortByPriority,
  PRIORITY_TIERS,
} from "@/lib/priority";
import type { ReportItem } from "@/types/report";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ApiResponse {
  success: boolean;
  data: ReportItem[];
  meta: { pagination: PaginationMeta };
}

// ── Sort options ──────────────────────────────────────────────────────────────

type SortMode = "priority" | "newest" | "upvotes";

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: "priority", label: "Prioritas Tertinggi" },
  { value: "newest", label: "Terbaru" },
  { value: "upvotes", label: "Dukungan Terbanyak" },
];

// ── Priority filter chip ──────────────────────────────────────────────────────

type PriorityFilter = "all" | "kritis" | "tinggi" | "sedang" | "rendah";

const PRIORITY_FILTER_OPTIONS: { value: PriorityFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "kritis", label: "Kritis" },
  { value: "tinggi", label: "Prioritas Tinggi" },
  { value: "sedang", label: "Prioritas Sedang" },
  { value: "rendah", label: "Prioritas Rendah" },
];

export default function ReportsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortMode, setSortMode] = useState<SortMode>("priority");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  // const [exportOpen, setExportOpen] = useState(false);

  // ── Tambahkan priorityScore ke setiap laporan ──────────────────────────────
  const reportsWithScore = useMemo<(ReportItem & { priorityScore: number })[]>(
    () =>
      reports.map((r) => ({
        ...r,
        priorityScore: calcPriorityScore(r.urgency, r.upvoteCount),
      })),
    [reports],
  );

  // ── Filter berdasarkan tier prioritas ─────────────────────────────────────
  const filteredReports = useMemo(() => {
    if (priorityFilter === "all") return reportsWithScore;
    return reportsWithScore.filter((r) => {
      const tier = getPriorityTier(r.priorityScore);
      return tier.labelShort.toLowerCase() === priorityFilter;
    });
  }, [reportsWithScore, priorityFilter]);

  // ── Sortir ────────────────────────────────────────────────────────────────
  const sortedReports = useMemo(() => {
    if (sortMode === "priority") return sortByPriority(filteredReports);
    if (sortMode === "upvotes")
      return [...filteredReports].sort((a, b) => b.upvoteCount - a.upvoteCount);
    return filteredReports;
  }, [filteredReports, sortMode]);

  // ── Debounce search → update URL ──────────────────────────────────────────
  useEffect(() => {
    const currentUrlSearch = searchParams.get("search") || "";
    if (searchTerm === currentUrlSearch) return;

    const t = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(t);
  }, [searchTerm, pathname, router, searchParams]);

  // ── Fetch data ────────────────────────────────────────────────────────────
  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentSearch = searchParams.get("search") || "";
      const currentPage = searchParams.get("page") || "1";

      const apiSort =
        sortMode === "upvotes" ? "upvoteCount_desc" : "createdAt_desc";

      const res = await fetch(
        `/api/reports?limit=12&page=${currentPage}&sort=${apiSort}${
          currentSearch ? `&search=${encodeURIComponent(currentSearch)}` : ""
        }`,
      );

      const json = (await res.json()) as ApiResponse;
      if (res.ok && json.data) {
        setReports(json.data);
        setPagination(json.meta?.pagination || null);
      }
    } catch (err) {
      console.error("Gagal memuat laporan:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, sortMode]);

  useEffect(() => {
    const t = setTimeout(() => fetchReports(), 0);
    return () => clearTimeout(t);
  }, [fetchReports]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Stats untuk chips ─────────────────────────────────────────────────────
  const tierStats = useMemo(() => {
    const result: Record<string, number> = { all: reportsWithScore.length };
    PRIORITY_TIERS.forEach((tier) => {
      result[tier.labelShort.toLowerCase()] = reportsWithScore.filter(
        (r) => getPriorityTier(r.priorityScore).labelShort === tier.labelShort,
      ).length;
    });
    return result;
  }, [reportsWithScore]);

  const hasActiveFilter = priorityFilter !== "all";

  return (
    <>
      {/* <ExportDialog open={exportOpen} onClose={() => setExportOpen(false)} /> */}

      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-6xl mx-auto px-4 mt-6 sm:mt-8">
          {/* ── Toolbar ── */}
          <div className="flex flex-col gap-3 mb-6">
            {/* Row 1: Search + Sort + Export */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cari laporan, lokasi..."
                  className="pl-9 h-9 text-sm bg-card"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* X untuk reset search */}
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="relative hidden sm:block">
                <SlidersHorizontal className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <select
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  className="h-9 pl-8 pr-3 rounded-md border border-input bg-background text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* <Button
                size="sm"
                variant="outline"
                onClick={() => setExportOpen(true)}
                className="h-9 gap-1.5 text-xs shrink-0"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export PDF</span>
              </Button> */}
            </div>

            {/* Row 2: Priority filter chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {PRIORITY_FILTER_OPTIONS.map((opt) => {
                const tier = PRIORITY_TIERS.find(
                  (t) => t.labelShort.toLowerCase() === opt.value,
                );
                const count = tierStats[opt.value] ?? 0;
                const isActive = priorityFilter === opt.value;

                return (
                  <button
                    key={opt.value}
                    onClick={() => setPriorityFilter(opt.value)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold",
                      "border transition-all duration-150 select-none ring-1",
                      isActive && opt.value === "all"
                        ? "bg-foreground/8 border-foreground/20 text-foreground ring-foreground/15"
                        : isActive && tier
                          ? [tier.bg, tier.color, tier.border, tier.ring]
                          : "border-border/60 text-muted-foreground ring-transparent hover:text-foreground hover:border-border",
                    )}
                  >
                    {tier && (
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0",
                          isActive ? "opacity-100" : "opacity-40",
                        )}
                        style={{ backgroundColor: tier.hex }}
                      />
                    )}
                    {opt.label}
                    <span
                      className={cn(
                        "tabular-nums font-mono text-[9px] px-1 py-0.5 rounded min-w-4 text-center",
                        isActive
                          ? "bg-current/10 text-current"
                          : "bg-muted/60 text-muted-foreground",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}

              {hasActiveFilter && (
                <button
                  onClick={() => setPriorityFilter("all")}
                  className="inline-flex items-center gap-1 px-2 py-1 text-[10px] text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* ── Content ── */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm">Memuat laporan...</p>
            </div>
          ) : sortedReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/20 border border-dashed border-border rounded-xl">
              <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-medium">
                {hasActiveFilter
                  ? "Tidak ada laporan untuk tier prioritas ini."
                  : "Laporan tidak ditemukan."}
              </p>
              {hasActiveFilter && (
                <button
                  onClick={() => setPriorityFilter("all")}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Tampilkan semua
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-4">
                Menampilkan{" "}
                <span className="font-semibold text-foreground">
                  {sortedReports.length}
                </span>{" "}
                laporan
                {hasActiveFilter && (
                  <span>
                    {" "}
                    · filter:{" "}
                    <span className="font-medium text-foreground">
                      {
                        PRIORITY_FILTER_OPTIONS.find(
                          (o) => o.value === priorityFilter,
                        )?.label
                      }
                    </span>
                  </span>
                )}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedReports.map((report) => (
                  <ReportPost key={report.id} report={report} />
                ))}
              </div>

              {pagination &&
                pagination.totalPages > 1 &&
                priorityFilter === "all" && (
                  <div className="flex items-center justify-center gap-4 mt-10">
                    <Button
                      variant="outline"
                      disabled={!pagination.hasPrev}
                      onClick={() => handlePageChange(pagination.page - 1)}
                      className="gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Sebelumnya
                    </Button>
                    <span className="text-sm font-medium text-foreground">
                      Halaman {pagination.page} dari {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={!pagination.hasNext}
                      onClick={() => handlePageChange(pagination.page + 1)}
                      className="gap-1"
                    >
                      Selanjutnya
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
