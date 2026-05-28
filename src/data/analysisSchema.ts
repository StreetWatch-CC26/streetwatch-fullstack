/**
 * data/analysis-schema.ts
 * Types, label maps, konstanta, dan mock analysis engine.
 */

import { Urgency } from "@/generated/prisma/enums";
import type { MLAnalysisResult } from "@/services/ml.service";

export interface AnalysisResult extends MLAnalysisResult {
  recommendations: string[];
}

export type AnalysisPhase =
  | "idle"
  | "reading"
  | "uploading"
  | "analyzing"
  | "done"
  | "error";

export const PHASE_LABEL: Record<AnalysisPhase, string> = {
  idle: "Menunggu",
  reading: "Membaca Gambar...",
  uploading: "Mengunggah Gambar...",
  analyzing: "Menganalisis...",
  done: "Selesai",
  error: "Terjadi Kesalahan",
};

// ─── Recommendation bank ──────────────────────────────────────────────────────

export const RECOMMENDATIONS: Record<Urgency, string[]> = {
  low: [
    "Tandai dan dokumentasikan titik lokasi secara berkala.",
    "Pantau perkembangan — tambal sebelum musim hujan tiba.",
  ],
  medium: [
    "Segera laporkan ke Dinas PU setempat.",
    "Pasang rambu peringatan di sekitar lokasi.",
    "Targetkan perbaikan dalam 7–14 hari kerja.",
  ],
  high: [
    "DARURAT — hubungi call center terkait sekarang.",
    "Pasang barikade dan rambu bahaya sesegera mungkin.",
    "Target penanganan dalam 1×24 jam.",
  ],
};
