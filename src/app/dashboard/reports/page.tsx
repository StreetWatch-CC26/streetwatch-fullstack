// src/app/dashboard/reports/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Loader2,
  Image as ImageIcon,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ReportPost } from "@/components/reports/ReportPost";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  meta: {
    pagination: PaginationMeta;
  };
}

export default function ReportsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Ambil state awal dari URL
  const initialSearch = searchParams.get("search") || "";

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState(initialSearch);

  // ── Debounce Pencarian ──────────────────────────────────────────────────────
  // Hanya memperbarui URL query setelah user berhenti mengetik selama 500ms
  useEffect(() => {
    // Ambil parameter search yang sedang aktif di URL browser saat ini
    const currentUrlSearch = searchParams.get("search") || "";

    // MENCEGAH INFINITE LOOP:
    if (searchTerm === currentUrlSearch) {
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }

      // Reset ke halaman 1 setiap kali pencarian berubah
      params.set("page", "1");

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, pathname, router, searchParams]);

  // ── Fetch Data ─────────────────────────────────────────────────────────────
  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentSearch = searchParams.get("search") || "";
      const currentPage = searchParams.get("page") || "1";

      const res = await fetch(
        `/api/reports?limit=12&page=${currentPage}&sort=createdAt_desc${
          currentSearch ? `&search=${encodeURIComponent(currentSearch)}` : ""
        }`,
      );

      const json = (await res.json()) as ApiResponse;

      if (res.ok && json.data) {
        setReports(json.data);
        setPagination(json.meta?.pagination || null);
      }
    } catch (error) {
      console.error("Gagal memuat daftar laporan:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  // Pantau perubahan parameter URL untuk trigger fetch ulang
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReports();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchReports]);

  // ── Handler Ganti Halaman ──────────────────────────────────────────────────
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-6xl mx-auto px-4 mt-6 sm:mt-8">
        {/* Header & Fitur Pencarian */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="sr-only">
            <h1 className="text-2xl font-bold text-foreground">
              Daftar Laporan
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Pantau kondisi jalan di sekitarmu
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari jalan, lokasi, atau deskripsi..."
              className="pl-9 bg-card border-border shadow-sm focus-visible:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* State Konten (Loading, Kosong, Hasil) */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-muted-foreground gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Mencari laporan...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/20 border border-dashed border-border rounded-xl">
            <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm font-medium">Laporan tidak ditemukan.</p>
          </div>
        ) : (
          <>
            {/* Grid Kartu Laporan */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {reports.map((report) => (
                <ReportPost key={report.id} report={report} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
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
  );
}
