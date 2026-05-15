/**
 * data/analysis-schema.ts
 * Types, label maps, konstanta, dan mock analysis engine.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type DamageCategory =
  | "lubang"
  | "retak"
  | "amblas"
  | "longsor"
  | "bergelombang"
  | "tidak_terdeteksi";

export type DamageLevel = "rendah" | "sedang" | "tinggi";

export interface AnalysisResult {
  isDamageDetected: boolean;
  category: DamageCategory;
  level: DamageLevel;
  /** Confidence score 0–100 */
  score: number;
  summary: string;
  recommendations: string[];
  analyzedAt: string;
}

export type AnalysisPhase =
  | "idle"
  | "reading"
  | "scanning"
  | "classifying"
  | "done"
  | "error";

// ─── Label & Style Maps ───────────────────────────────────────────────────────

export const CATEGORY_LABEL: Record<DamageCategory, string> = {
  lubang: "Lubang Jalan",
  retak: "Retakan Aspal",
  amblas: "Penurunan Permukaan",
  longsor: "Longsor Tepi Jalan",
  bergelombang: "Jalan Bergelombang",
  tidak_terdeteksi: "Tidak Terdeteksi",
};

export const LEVEL_LABEL: Record<DamageLevel, string> = {
  rendah: "Rendah",
  sedang: "Sedang",
  tinggi: "Tinggi",
};

export const LEVEL_CONFIG: Record<
  DamageLevel,
  {
    hex: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
    badgeClass: string;
  }
> = {
  rendah: {
    hex: "#22c55e",
    bgClass: "bg-green-500/8",
    borderClass: "border-green-500/30",
    textClass: "text-green-600 dark:text-green-400",
    badgeClass:
      "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/25",
  },
  sedang: {
    hex: "#eab308",
    bgClass: "bg-yellow-500/8",
    borderClass: "border-yellow-500/30",
    textClass: "text-yellow-600 dark:text-yellow-400",
    badgeClass:
      "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/25",
  },
  tinggi: {
    hex: "#ef4444",
    bgClass: "bg-red-500/8",
    borderClass: "border-red-500/30",
    textClass: "text-red-600 dark:text-red-400",
    badgeClass:
      "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/25",
  },
};

export const PHASE_LABEL: Record<AnalysisPhase, string> = {
  idle: "Siap dianalisis",
  reading: "Membaca gambar…",
  scanning: "Memindai pola kerusakan…",
  classifying: "Mengklasifikasikan hasil…",
  done: "Analisis selesai",
  error: "Analisis gagal",
};

// ─── Recommendation bank ──────────────────────────────────────────────────────

const REC: Record<DamageLevel, string[]> = {
  rendah: [
    "Tandai dan dokumentasikan titik lokasi secara berkala.",
    "Pantau perkembangan — tambal sebelum musim hujan tiba.",
    "Pasang tanda peringatan sementara jika diperlukan.",
  ],
  sedang: [
    "Segera laporkan ke Dinas PU setempat.",
    "Pasang rambu peringatan di sekitar lokasi.",
    "Hindari kendaraan berat melintas sementara waktu.",
    "Targetkan perbaikan dalam 7–14 hari kerja.",
  ],
  tinggi: [
    "DARURAT — hubungi Dinas PU / call center 08001234 sekarang.",
    "Pasang barikade dan rambu bahaya sesegera mungkin.",
    "Larang seluruh kendaraan melintas hingga diperbaiki.",
    "Target penanganan dalam 1×24 jam.",
  ],
};

// ─── Mock pool ────────────────────────────────────────────────────────────────

const POOL: Omit<AnalysisResult, "analyzedAt">[] = [
  {
    isDamageDetected: true,
    category: "lubang",
    level: "tinggi",
    score: 87,
    summary: "Terdeteksi lubang dalam berdiameter besar di jalur utama.",
    recommendations: REC.tinggi,
  },
  {
    isDamageDetected: true,
    category: "retak",
    level: "sedang",
    score: 63,
    summary: "Retakan memanjang ditemukan di permukaan aspal.",
    recommendations: REC.sedang,
  },
  {
    isDamageDetected: true,
    category: "bergelombang",
    level: "rendah",
    score: 32,
    summary: "Permukaan jalan sedikit bergelombang, belum membahayakan.",
    recommendations: REC.rendah,
  },
  {
    isDamageDetected: true,
    category: "amblas",
    level: "tinggi",
    score: 91,
    summary: "Penurunan permukaan jalan signifikan terdeteksi di area ini.",
    recommendations: REC.tinggi,
  },
  {
    isDamageDetected: true,
    category: "longsor",
    level: "sedang",
    score: 58,
    summary: "Terdeteksi erosi dan longsoran kecil di tepi badan jalan.",
    recommendations: REC.sedang,
  },
  {
    isDamageDetected: false,
    category: "tidak_terdeteksi",
    level: "rendah",
    score: 7,
    summary: "Tidak ada kerusakan jalan yang terdeteksi pada gambar ini.",
    recommendations: [
      "Pastikan foto diambil langsung menghadap permukaan jalan.",
      "Coba upload gambar dengan pencahayaan yang lebih baik.",
    ],
  },
];

// ─── Mock engine ──────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export async function runMockAnalysis(
  _imageBase64: string,
  onPhase: (p: AnalysisPhase) => void,
): Promise<AnalysisResult> {
  onPhase("reading");
  await sleep(700);
  onPhase("scanning");
  await sleep(1000);
  onPhase("classifying");
  await sleep(800);
  onPhase("done");

  const pick = POOL[Math.floor(Math.random() * POOL.length)];
  return { ...pick, analyzedAt: new Date().toISOString() };
}
