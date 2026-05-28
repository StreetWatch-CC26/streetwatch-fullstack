import { Urgency } from "@/generated/prisma/enums";
import { MLDetectResponse } from "@/services/ml.service";

export const URGENCY_LABEL: Record<string, string> = {
  high: "Tinggi",
  medium: "Sedang",
  low: "Rendah",
};

export const URGENCY_COLOR: Record<string, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export const STATUS_LABEL: Record<string, string> = {
  verified: "Terverifikasi",
  fail: "Analisis Gagal",
};

export const STATUS_COLOR: Record<string, string> = {
  verified:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200",
  fail: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200",
};

export const CATEGORY_LABEL: Record<string, string> = {
  lubang: "Lubang",
  retak: "Retak",
  amblas: "Amblas",
  longsor: "Longsor",
  bergelombang: "Bergelombang",
  lainnya: "Lainnya",
};

export const SEVERITY_MAP: Record<
  MLDetectResponse["image_severity"],
  Urgency | null
> = {
  Parah: "high",
  Sedang: "medium",
  Ringan: "low",
};

export const LEVEL_LABEL: Record<string, string> = {
  high: "Parah",
  medium: "Sedang",
  low: "Ringan",
};

export const LEVEL_CONFIG: Record<
  string,
  {
    hex: string;
    borderClass: string;
    bgClass: string;
    textClass: string;
    badgeClass: string;
  }
> = {
  high: {
    hex: "#ef4444", // red-500
    borderClass: "border-red-200 dark:border-red-900/50",
    bgClass: "bg-red-50/50 dark:bg-red-950/20",
    textClass: "text-red-700 dark:text-red-400",
    badgeClass:
      "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  medium: {
    hex: "#f59e0b", // amber-500
    borderClass: "border-amber-200 dark:border-amber-900/50",
    bgClass: "bg-amber-50/50 dark:bg-amber-950/20",
    textClass: "text-amber-700 dark:text-amber-400",
    badgeClass:
      "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  low: {
    hex: "#22c55e", // green-500
    borderClass: "border-green-200 dark:border-green-900/50",
    bgClass: "bg-green-50/50 dark:bg-green-950/20",
    textClass: "text-green-700 dark:text-green-400",
    badgeClass:
      "border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
};
