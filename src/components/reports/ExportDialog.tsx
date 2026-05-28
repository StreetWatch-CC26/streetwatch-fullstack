"use client";

/**
 * components/reports/ExportDialog.tsx
 *
 * Modal dialog untuk:
 * 1. Memilih filter export (tanggal, provinsi, kota, urgency)
 * 2. Preview jumlah data yang akan diekspor
 * 3. Generate PDF menggunakan jsPDF
 *
 * PDF berisi:
 * - Cover page dengan summary statistik
 * - Tabel laporan diurutkan priorityScore DESC
 * - Footer dengan metadata export
 */

import { useState, useCallback } from "react";
import { FileDown, X, Loader2, AlertCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { calcPriorityScore, sortByPriority } from "@/lib/priority";
import type {
  ExportDialogProps,
  ExportFilters,
  ReportItem,
} from "@/types/report";
import { generatePDF } from "@/lib/pdfGenerator";
import { useWilayahFilter } from "@/hooks/useWilayahFilter";

const URGENCY_OPTIONS = [
  { value: "", label: "Semua Tingkat" },
  { value: "high", label: "Parah (High)" },
  { value: "medium", label: "Sedang (Medium)" },
  { value: "low", label: "Ringan (Low)" },
];

export function ExportDialog({ open, onClose }: ExportDialogProps) {
  const [filters, setFilters] = useState<ExportFilters>({
    dateFrom: "",
    dateTo: "",
    provinsi: "",
    kota: "",
    urgency: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const {
    provinsiList,
    kabupatenList,
    selectedProvinsi,
    selectedKabupaten,
    selectProvinsi,
    selectKabupaten,
    loadingProvinsi,
    loadingKabupaten,
  } = useWilayahFilter();

  const setField = (key: keyof ExportFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPreviewCount(null);
  };

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);
    if (filters.provinsi) params.set("provinsi", filters.provinsi);
    if (filters.kota) params.set("kota", filters.kota);
    if (filters.urgency) params.set("urgency", filters.urgency);
    return params.toString();
  }, [filters]);

  const handlePreview = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reports/export?${buildQuery()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setPreviewCount(json.meta.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat preview");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reports/export?${buildQuery()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      // Hitung priorityScore client-side
      const reportsWithScore = (json.data as ReportItem[]).map((r) => ({
        ...r,
        priorityScore: calcPriorityScore(r.urgency, r.upvoteCount),
      }));

      // Sort by priorityScore desc
      const sorted = sortByPriority(reportsWithScore);

      await generatePDF(sorted, filters, json.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal generate PDF");
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                <FileDown className="w-4 h-4 text-primary" />
                Export Laporan PDF
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pilih filter sebelum export
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-4">
            {/* Date range */}
            <div>
              <label className="text-xs font-semibold text-foreground/70 mb-1.5 block">
                Rentang Tanggal
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1">Dari</p>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setField("dateFrom", e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground mb-1">
                    Sampai
                  </p>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setField("dateTo", e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Wilayah */}
            <div>
              <label className="text-xs font-semibold text-foreground/70 mb-1.5 block">
                Wilayah
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <select
                    value={selectedProvinsi?.id || ""}
                    onChange={(e) => {
                      const id = e.target.value;
                      const item =
                        provinsiList.find((p) => p.id === id) || null;

                      selectProvinsi(item);

                      setField("provinsi", item ? item.nama : "");
                      setField("kota", "");
                    }}
                    disabled={loadingProvinsi}
                    className={cn(
                      "w-full h-8 pl-3 pr-8 rounded-md border border-input bg-background text-xs",
                      "appearance-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50",
                    )}
                  >
                    <option value="">Seluruh Indonesia</option>

                    {provinsiList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nama}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={selectedKabupaten?.id || ""}
                    onChange={(e) => {
                      const id = e.target.value;
                      const item =
                        kabupatenList.find((k) => k.id === id) || null;

                      selectKabupaten(item);

                      setField("kota", item ? item.nama : "");
                    }}
                    disabled={!selectedProvinsi || loadingKabupaten}
                    className={cn(
                      "w-full h-8 pl-3 pr-8 rounded-md border border-input bg-background text-xs",
                      "appearance-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50",
                    )}
                  >
                    <option value="">Semua Kota/Kab</option>

                    {kabupatenList.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.nama}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="text-xs font-semibold text-foreground/70 mb-1.5 block">
                Tingkat Keparahan (AI)
              </label>
              <div className="relative">
                <select
                  value={filters.urgency}
                  onChange={(e) => setField("urgency", e.target.value)}
                  className={cn(
                    "w-full h-8 pl-3 pr-8 rounded-md border border-input bg-background text-xs",
                    "appearance-none focus:outline-none focus:ring-2 focus:ring-ring",
                  )}
                >
                  {URGENCY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Preview result */}
            {previewCount !== null && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary/8 border border-primary/20 text-xs text-primary font-medium">
                <span className="text-base">📋</span>
                {previewCount === 0
                  ? "Tidak ada laporan yang sesuai filter."
                  : `${previewCount} laporan akan diekspor, diurutkan berdasarkan skor prioritas.`}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-destructive/8 border border-destructive/20 text-xs text-destructive">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 px-5 pb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreview}
              disabled={isLoading}
              className="flex-1 h-9 text-xs"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                "Cek Jumlah Data"
              )}
            </Button>
            <Button
              size="sm"
              onClick={handleExport}
              disabled={isLoading || previewCount === 0}
              className="flex-1 h-9 text-xs gap-1.5 bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  Export PDF
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
