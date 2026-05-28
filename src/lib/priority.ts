/**
 * lib/priority.ts
 *
 * Kalkulasi skor prioritas perbaikan jalan berdasarkan dua dimensi:
 *   - Keparahan AI  (urgency)    : bobot 60%
 *   - Dukungan warga (upvoteCount): bobot 40%
 *
 * Formula:
 *   urgencyScore = high→1.0 | medium→0.6 | low→0.3
 *   upvoteScore  = min(upvoteCount / UPVOTE_CAP, 1.0)
 *   priorityScore = (urgencyScore × 0.60) + (upvoteScore × 0.40)
 *
 * Rationale cap 50:
 *   Mencegah laporan viral (200+ upvote) menenggelamkan jalan kritis yang
 *   baru dilaporkan. 50 upvote = "community consensus" yang cukup bermakna.
 */

export type Urgency = "high" | "medium" | "low";

export interface PriorityTier {
  label: string;
  labelShort: string;
  color: string;
  bg: string;
  border: string;
  ring: string;
  hex: string;
  minScore: number;
}

// ── Konstanta ─────────────────────────────────────────────────────────────────

const URGENCY_WEIGHT = 0.6;
const UPVOTE_WEIGHT = 0.4;
const UPVOTE_CAP = 50;

const URGENCY_SCORE: Record<Urgency, number> = {
  high: 1.0,
  medium: 0.6,
  low: 0.3,
};

export const PRIORITY_TIERS: PriorityTier[] = [
  {
    label: "Kritis",
    labelShort: "KRITIS",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    ring: "ring-red-500/40",
    hex: "#dc2626",
    minScore: 0.75,
  },
  {
    label: "Prioritas Tinggi",
    labelShort: "TINGGI",
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    ring: "ring-orange-500/40",
    hex: "#ea580c",
    minScore: 0.5,
  },
  {
    label: "Prioritas Sedang",
    labelShort: "SEDANG",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    ring: "ring-amber-500/40",
    hex: "#d97706",
    minScore: 0.25,
  },
  {
    label: "Prioritas Rendah",
    labelShort: "RENDAH",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    ring: "ring-green-500/40",
    hex: "#16a34a",
    minScore: 0,
  },
];

// ── Core functions ────────────────────────────────────────────────────────────

/**
 * Hitung skor prioritas (0.0 – 1.0)
 */
export function calcPriorityScore(
  urgency: Urgency | string,
  upvoteCount: number,
): number {
  const uScore = URGENCY_SCORE[urgency as Urgency] ?? URGENCY_SCORE.low;
  const vScore = Math.min(upvoteCount / UPVOTE_CAP, 1.0);
  const raw = uScore * URGENCY_WEIGHT + vScore * UPVOTE_WEIGHT;
  // Round ke 4 desimal agar mudah dibandingkan
  return Math.round(raw * 10000) / 10000;
}

/**
 * Ambil tier berdasarkan score
 */
export function getPriorityTier(score: number): PriorityTier {
  for (const tier of PRIORITY_TIERS) {
    if (score >= tier.minScore) return tier;
  }
  return PRIORITY_TIERS[PRIORITY_TIERS.length - 1];
}

/**
 * Format score menjadi persentase string, misal "78%"
 */
export function formatScore(score: number): string {
  return `${Math.round(score * 100)}%`;
}

/**
 * Sortir array laporan berdasarkan priorityScore desc
 */
export function sortByPriority<T extends { priorityScore: number }>(
  items: T[],
): T[] {
  return [...items].sort((a, b) => b.priorityScore - a.priorityScore);
}
