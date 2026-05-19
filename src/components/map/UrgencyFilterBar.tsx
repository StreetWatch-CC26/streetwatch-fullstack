"use client";

/**
 * components/map/UrgencyFilterBar.tsx
 *
 * Filter chip bar untuk memfilter marker peta berdasarkan tingkat kerusakan.
 *
 * Desain keputusan:
 * - "Semua" diperlakukan sebagai shortcut untuk select/deselect semua level.
 * - Multi-select: user bisa aktifkan beberapa level sekaligus.
 * - Count badge menampilkan jumlah laporan per level secara real-time dari prop `counts`.
 * - Sepenuhnya controlled — state dikelola oleh parent via hook `useUrgencyFilter`.
 */

import { cn } from "@/lib/utils";
import type { Urgency } from "@/generated/prisma/enums";

// ── Konstanta level urgensi ───────────────────────────────────────────────────

export interface UrgencyLevel {
  value: Urgency;
  label: string;
  /** Warna dot & ring aktif */
  color: string;
  /** Tailwind bg class saat chip aktif */
  activeBg: string;
  /** Tailwind text class saat chip aktif */
  activeText: string;
  /** Tailwind ring class saat chip aktif */
  activeRing: string;
}

export const URGENCY_LEVELS: UrgencyLevel[] = [
  {
    value: "high",
    label: "Tinggi",
    color: "#ef4444",
    activeBg: "bg-red-500/12",
    activeText: "text-red-600 dark:text-red-400",
    activeRing: "ring-red-500/40",
  },
  {
    value: "medium",
    label: "Sedang",
    color: "#f59e0b",
    activeBg: "bg-amber-500/12",
    activeText: "text-amber-600 dark:text-amber-400",
    activeRing: "ring-amber-500/40",
  },
  {
    value: "low",
    label: "Rendah",
    color: "#22c55e",
    activeBg: "bg-green-500/12",
    activeText: "text-green-600 dark:text-green-400",
    activeRing: "ring-green-500/40",
  },
] as const;

// ── Types ─────────────────────────────────────────────────────────────────────

export type UrgencyFilterState = Set<Urgency>;

export interface UrgencyCounts {
  high: number;
  medium: number;
  low: number;
}

export interface UrgencyFilterBarProps {
  /** Set level yang sedang aktif. Set kosong = tampilkan semua. */
  activeFilters: UrgencyFilterState;
  /** Jumlah laporan per level (setelah filter wilayah diterapkan). */
  counts: UrgencyCounts;
  /** Callback saat user mengubah filter. */
  onChange: (next: UrgencyFilterState) => void;
  className?: string;
}

// ── Helper ────────────────────────────────────────────────────────────────────

/** True jika semua level aktif atau tidak ada filter yang dipilih (= tampilkan semua). */
function isAllActive(filters: UrgencyFilterState): boolean {
  return (
    filters.size === 0 || URGENCY_LEVELS.every((l) => filters.has(l.value))
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function UrgencyFilterBar({
  activeFilters,
  counts,
  onChange,
  className,
}: UrgencyFilterBarProps) {
  const allActive = isAllActive(activeFilters);
  const totalCount = counts.high + counts.medium + counts.low;

  function handleAllClick() {
    // Reset ke "tampilkan semua" dengan set kosong
    onChange(new Set());
  }

  function handleChipClick(value: Urgency) {
    const next = new Set(activeFilters);

    if (allActive) {
      // Dari "Semua" → isolasi hanya level yang diklik
      next.clear();
      next.add(value);
    } else if (next.has(value)) {
      next.delete(value);
      // Jika setelah hapus tidak ada yang aktif → reset ke semua
      if (next.size === 0) {
        onChange(new Set());
        return;
      }
    } else {
      next.add(value);
      // Jika semua level aktif → normalisasi ke set kosong
      if (URGENCY_LEVELS.every((l) => next.has(l.value))) {
        onChange(new Set());
        return;
      }
    }

    onChange(next);
  }

  return (
    <div
      className={cn("flex items-center gap-1.5 flex-wrap", className)}
      role="group"
      aria-label="Filter tingkat kerusakan"
    >
      {/* Chip "Semua" */}
      <button
        onClick={handleAllClick}
        aria-pressed={allActive}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold",
          "border transition-all duration-150 select-none",
          "ring-1 ring-transparent",
          allActive
            ? "bg-foreground/8 border-foreground/20 text-foreground ring-foreground/15"
            : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border",
        )}
      >
        Semua
        <CountBadge count={totalCount} muted={!allActive} />
      </button>

      {/* Chip per level */}
      {URGENCY_LEVELS.map((level) => {
        const isActive = !allActive && activeFilters.has(level.value);
        const count = counts[level.value];

        return (
          <button
            key={level.value}
            onClick={() => handleChipClick(level.value)}
            aria-pressed={isActive}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold",
              "border transition-all duration-150 select-none",
              "ring-1",
              isActive
                ? [
                    level.activeBg,
                    level.activeText,
                    level.activeRing,
                    "border-transparent",
                  ]
                : "border-border/60 text-muted-foreground ring-transparent hover:text-foreground hover:border-border",
            )}
          >
            {/* Dot indikator warna */}
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0 transition-opacity duration-150",
                isActive ? "opacity-100" : "opacity-50",
              )}
              style={{ backgroundColor: level.color }}
            />
            {level.label}
            <CountBadge count={count} muted={!isActive} />
          </button>
        );
      })}
    </div>
  );
}

// ── Sub-component: Count Badge ─────────────────────────────────────────────────

interface CountBadgeProps {
  count: number;
  muted: boolean;
}

function CountBadge({ count, muted }: CountBadgeProps) {
  return (
    <span
      className={cn(
        "tabular-nums font-mono text-[9px] leading-none",
        "px-1 py-0.5 rounded min-w-4 text-center",
        muted
          ? "bg-muted/60 text-muted-foreground"
          : "bg-current/10 text-current",
      )}
    >
      {count}
    </span>
  );
}
