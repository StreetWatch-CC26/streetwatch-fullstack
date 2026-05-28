"use client";

/**
 * components/reports/PriorityBadge.tsx
 *
 * Badge visual yang menampilkan skor prioritas dan tier-nya.
 * Digunakan di ReportPost card dan detail page.
 */

import { cn } from "@/lib/utils";
import {
  calcPriorityScore,
  getPriorityTier,
  formatScore,
} from "@/lib/priority";

interface PriorityBadgeProps {
  urgency: string;
  upvoteCount: number;
  /** Tampilkan breakdown score (untuk detail page) */
  showBreakdown?: boolean;
  className?: string;
}

export function PriorityBadge({
  urgency,
  upvoteCount,
  showBreakdown = false,
  className,
}: PriorityBadgeProps) {
  const score = calcPriorityScore(urgency, upvoteCount);
  const tier = getPriorityTier(score);

  if (showBreakdown) {
    return (
      <div
        className={cn(
          "flex flex-col gap-1.5 px-3 py-2.5 rounded-xl border",
          tier.bg,
          tier.border,
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <span className={cn("text-xs font-bold tracking-wide", tier.color)}>
            {tier.label}
          </span>
          <span className={cn("text-sm font-bold tabular-nums", tier.color)}>
            {formatScore(score)}
          </span>
        </div>

        {/* Score bar */}
        <div className="h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              tier.bg.replace("/10", "/80"),
            )}
            style={{ width: `${score * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>
            AI {Math.round(((score * 0.6) / 0.6) * 100)}% · Warga {upvoteCount}{" "}
            dukungan
          </span>
          <span className="font-mono">{score.toFixed(3)}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border",
        "text-[10px] font-bold tracking-wide select-none",
        tier.bg,
        tier.border,
        tier.color,
        className,
      )}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: tier.hex }}
      />
      {tier.labelShort}
      <span className="font-mono opacity-70">{formatScore(score)}</span>
    </div>
  );
}
