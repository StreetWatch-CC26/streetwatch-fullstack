"use client";

/**
 * components/dashboard/ReportPanel.tsx
 *
 * Panel detail laporan.
 * Mobile : bottom sheet (slide up dari bawah)
 * Desktop: floating card pojok kanan bawah
 */

import { useEffect } from "react";
import Image from "next/image";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import {
  X,
  MapPin,
  Calendar,
  ThumbsUp,
  Share2,
  ExternalLink,
  Tag,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Report } from "@/generated/prisma/browser";

// ─── Label / colour maps ──────────────────────────────────────────────────────

const URGENCY_LABEL = {
  high: "Tinggi",
  medium: "Sedang",
  low: "Rendah",
} as const;
const STATUS_LABEL = {
  fail: "Analisis Gagal",
  verified: "Terverifikasi",
} as const;
const CATEGORY_LABEL = {
  lubang: "Lubang",
  retak: "Retak",
  amblas: "Amblas",
  longsor: "Longsor",
  bergelombang: "Bergelombang",
  lainnya: "Lainnya",
} as const;

const URGENCY_COLOR: Record<string, string> = {
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  medium:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};
const STATUS_COLOR: Record<string, string> = {
  fail: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  verified: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  report: Report;
  upvotes: number;
  hasVoted: boolean;
  onVote: () => void;
  onClose: () => void;
}

export function ReportPanel({
  report,
  upvotes,
  hasVoted,
  onVote,
  onClose,
}: Props) {
  // Close on Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  const share = () => {
    if (navigator.share) {
      navigator.share({
        title: report.title,
        text: report.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="md:hidden fixed inset-0 bg-black/25 backdrop-blur-[2px] z-450"
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed md:absolute z-460",
          "bottom-0 left-0 right-0 rounded-t-2xl",
          "md:bottom-4 md:right-4 md:left-auto md:w-80 md:rounded-2xl",
          "bg-background border border-border",
          "shadow-2xl shadow-black/15",
          "animate-in slide-in-from-bottom-4 duration-250",
          // Tambahkan max-height agar bisa di-scroll jika konten (terutama gambar) terlalu panjang di HP kecil
          "max-h-[90vh] flex flex-col",
        )}
      >
        {/* Drag handle (mobile) */}
        <div className="md:hidden flex justify-center pt-2.5 pb-0.5 shrink-0">
          <div className="w-8 h-1 rounded-full bg-muted-foreground/25" />
        </div>

        {/* Header */}
        <div className="flex items-start gap-2 px-4 pt-3 md:pt-4 pb-3 border-b border-border shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="text-[10px] font-mono text-muted-foreground">
                {report.id}
              </span>
              <Badge
                className={cn(
                  "text-[10px] px-1.5 py-0 font-medium",
                  URGENCY_COLOR[report.urgency],
                )}
              >
                {URGENCY_LABEL[report.urgency]}
              </Badge>
            </div>
            <h3 className="font-heading font-bold text-sm text-foreground leading-snug line-clamp-2">
              {report.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 hover:bg-muted/70 transition-colors mt-0.5"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="px-4 py-3 space-y-3 overflow-y-auto overscroll-contain">
          {/* ─── Image Section ─── */}
          {report.imageUrl ? (
            <div className="relative w-full h-36 md:h-40 rounded-lg overflow-hidden border border-border shrink-0 bg-muted">
              <Image
                src={report.imageUrl}
                alt={`Foto laporan: ${report.title}`}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 320px"
              />
            </div>
          ) : (
            // Placeholder
            <div className="w-full h-12 rounded-lg border border-dashed border-border bg-muted/50 flex items-center justify-center gap-2 text-muted-foreground shrink-0">
              <ImageIcon className="w-4 h-4 opacity-50" />
              <span className="text-xs font-medium opacity-50">
                Tidak ada foto
              </span>
            </div>
          )}

          {/* Location */}
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs leading-snug">
              <p className="font-medium text-foreground">{report.address}</p>
              <p className="text-muted-foreground mt-0.5">
                {[report.kecamatan, report.kota, report.provinsi]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {report.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            <Badge
              className={cn(
                "text-[10px] px-2 py-0.5 gap-1",
                STATUS_COLOR[report.status],
              )}
            >
              <Clock className="w-2.5 h-2.5" />
              {STATUS_LABEL[report.status]}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-2 py-0.5 gap-1">
              <Tag className="w-2.5 h-2.5" />
              {CATEGORY_LABEL[report.category]}
            </Badge>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {format(new Date(report.createdAt), "d MMMM yyyy", {
              locale: idLocale,
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-4 pb-4 md:pb-4 pt-3 border-t border-border shrink-0 bg-background rounded-b-2xl">
          {/* Upvote */}
          <Button
            size="sm"
            variant={hasVoted ? "default" : "outline"}
            onClick={onVote}
            className={cn(
              "flex-1 h-9 gap-1.5 text-xs font-semibold transition-all",
              hasVoted
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                : "hover:border-primary hover:text-primary",
            )}
          >
            <ThumbsUp
              className={cn("w-3.5 h-3.5", hasVoted && "fill-current")}
            />
            {hasVoted ? "Didukung" : "Dukung"}
            <span
              className={cn(
                "ml-0.5 px-1.5 py-0 rounded-full text-[10px] font-bold",
                hasVoted
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {upvotes}
            </span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-9 w-9 p-0 shrink-0"
            onClick={share}
            title="Bagikan"
          >
            <Share2 className="w-3.5 h-3.5" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-9 w-9 p-0 shrink-0"
            title="Lihat detail"
            onClick={() =>
              window.open(`/dashboard/reports/${report.id}`, "_blank")
            }
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </>
  );
}
