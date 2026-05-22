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
