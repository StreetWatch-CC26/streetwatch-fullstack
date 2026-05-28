"use client";

/**
 * components/playground/AnalysisResultCard.tsx
 *
 * Menampilkan hasil analisis: skor, level kerusakan, kategori, ringkasan, rekomendasi.
 * CTA "Buat Laporan" navigasi ke /dashboard/reports/new tanpa re-analyze.
 */

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Clock,
  Tag,
  Lightbulb,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABEL, LEVEL_CONFIG, LEVEL_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ReportItem } from "@/types/report";
import { AnalysisResult } from "@/data/analysisSchema";

// ── Score ring SVG ──────────────────────────────────────────────────────────

function ScoreRing({ score, hex }: { score: number; hex: string }) {
  const r = 30;
  const cx = 40;
  const cy = 40;
  const circumference = 2 * Math.PI * r;
  const strokeDash = (score / 100) * circumference;

  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="shrink-0">
      {/* Track */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        className="text-muted/40"
      />
      {/* Progress */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={hex}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${strokeDash} ${circumference}`}
        strokeDashoffset={circumference / 4}
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
      {/* Label */}
      <text
        x={cx}
        y={cy - 5}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="14"
        fontWeight="700"
        fill={hex}
      >
        {score}
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        fontSize="7"
        fill="currentColor"
        className="fill-muted-foreground"
      >
        /100
      </text>
    </svg>
  );
}

// ── Level icon ──────────────────────────────────────────────────────────────

function LevelIcon({
  level,
  className,
}: {
  level: ReportItem["urgency"];
  className?: string;
}) {
  // FIX 3: Changed flex-shrink-0 to shrink-0
  const cls = cn("shrink-0", className);
  if (level === "low")
    return <CheckCircle2 className={cn(cls, "text-green-500")} />;
  if (level === "medium")
    return <AlertTriangle className={cn(cls, "text-yellow-500")} />;
  return <XCircle className={cn(cls, "text-red-500")} />;
}

// ── Component ───────────────────────────────────────────────────────────────

// FIX 2: Extended the intersection type to include summary, score, and analyzedAt
interface Props {
  result: AnalysisResult & {
    urgency: ReportItem["urgency"];
    category: ReportItem["category"];
    summary: string;
    score: number;
    analyzedAt: string | Date;
  };
}

export function AnalysisResultCard({ result }: Props) {
  const router = useRouter();
  const cfg = LEVEL_CONFIG[result.urgency];

  return (
    <div
      className={cn(
        "rounded-2xl border overflow-hidden animate-in fade-in-0 slide-in-from-bottom-2 duration-400",
        cfg.borderClass,
        cfg.bgClass,
      )}
    >
      {/* Header band */}
      <div
        className={cn(
          "flex items-center justify-between gap-3 px-4 py-3 border-b",
          cfg.borderClass,
        )}
      >
        <div className="flex items-center gap-2.5">
          <LevelIcon level={result.urgency} className="w-4.5 h-4.5" />
          <div>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
              Hasil Analisis
            </p>
            <p className={cn("text-sm font-bold leading-tight", cfg.textClass)}>
              {result.isDamageDetected
                ? result.summary
                : "Tidak ada kerusakan terdeteksi"}
            </p>
          </div>
        </div>

        {/* Score ring */}
        <ScoreRing score={result.score} hex={cfg.hex} />
      </div>

      {/* Body */}
      <div className="px-4 py-4 space-y-4">
        {/* Tags row */}
        <div className="flex flex-wrap gap-2">
          <Badge
            className={cn(
              "text-[10px] px-2 py-0.5 border font-semibold gap-1",
              cfg.badgeClass,
            )}
          >
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: cfg.hex }}
            />
            Kerusakan {LEVEL_LABEL[result.urgency]}
          </Badge>
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 gap-1">
            <Tag className="w-2.5 h-2.5" />
            {CATEGORY_LABEL[result.category]}
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] px-2 py-0.5 gap-1 ml-auto"
          >
            <Clock className="w-2.5 h-2.5" />
            {format(new Date(result.analyzedAt), "HH:mm · d MMM", {
              locale: idLocale,
            })}
          </Badge>
        </div>

        {/* Recommendations */}
        {result.isDamageDetected && result.recommendations.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs font-semibold text-foreground">
                Rekomendasi
              </p>
            </div>
            <ul className="space-y-1.5">
              {result.recommendations.map((rec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"
                >
                  {/* FIX 3: Changed flex-shrink-0 to shrink-0 */}
                  <span className="mt-1 w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-[9px] font-bold">
                    {i + 1}
                  </span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        {result.isDamageDetected && (
          <Button
            className="w-full gap-2 mt-1"
            onClick={() => router.push("/dashboard/reports/new")}
          >
            <FileText className="w-4 h-4" />
            Buat Laporan Sekarang
            <ChevronRight className="w-3.5 h-3.5 ml-auto" />
          </Button>
        )}

        {/* Not detected CTA */}
        {!result.isDamageDetected && (
          <p className="text-xs text-muted-foreground text-center py-2 px-4 rounded-xl bg-muted/30 border border-border">
            Coba upload foto jalan yang lebih jelas atau dari sudut berbeda.
          </p>
        )}
      </div>
    </div>
  );
}
