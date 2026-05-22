import type { Urgency } from "@/generated/prisma/enums";
import { SEVERITY_MAP } from "@/lib/constants";

// ── Raw response dari ML endpoint ────────────────────────────────────────────
export interface MLDetectResponse {
  is_road: boolean;
  total_potholes: number;
  image_severity: "Parah" | "Sedang" | "Ringan";
  detections: {
    bbox: [number, number, number, number];
    severity: "string";
    confidence: number;
  }[];
}

// ── Hasil setelah mapping ke domain model ────────────────────────────────────

export interface MLAnalysisResult {
  /** true = kerusakan terdeteksi, false = jalan mulus */
  isDamageDetected: boolean;
  totalPotholes: number;
  urgency: Urgency | null;
  /** image_severity asli dari model */
  rawSeverity: MLDetectResponse["image_severity"];
  /** Bounding boxes hasil deteksi */
  detections: MLDetectResponse["detections"];
  overallConfidence: number | null;
}

// ── Custom error ─────────────────────────────────────────────────────────────

export class MLNotRoadError extends Error {
  constructor() {
    super(
      "Foto yang diunggah bukan foto jalan. Silakan gunakan foto jalan yang rusak.",
    );
    this.name = "MLNotRoadError";
  }
}

export class MLServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = "MLServiceError";
  }
}

export class MLNoDamageError extends Error {
  constructor() {
    super(
      "Tidak ada kerusakan yang terdeteksi pada gambar. Pastikan foto menunjukkan kerusakan jalan yang jelas.",
    );
    this.name = "MLNoDamageError";
  }
}

// ── Main service function ─────────────────────────────────────────────────────

/**
 * Kirim URL gambar ke ML endpoint dan kembalikan hasil analisis terstruktur.
 *
 * @throws {MLNotRoadError}   jika model mendeteksi bukan foto jalan
 * @throws {MLServiceError}   jika request gagal / timeout / response tidak valid
 */
export async function analyzeImageWithML(
  imageUrl: string,
  signal?: AbortSignal,
): Promise<MLAnalysisResult> {
  const baseUrl = process.env.MODEL_BASE_URL;
  if (!baseUrl) {
    throw new MLServiceError(
      "MODEL_BASE_URL tidak dikonfigurasi di environment.",
    );
  }

  // Gunakan endpoint yang sama dengan Postman
  const endpoint = `${baseUrl}/detect`;
  const timeoutMs = 30_000;
  const internalSignal = AbortSignal.timeout(timeoutMs);
  const combinedSignal = signal
    ? AbortSignal.any([signal, internalSignal])
    : internalSignal;

  console.log("==================================================");
  console.log(`[ML Request] 🚀 Memulai proses analisis ML...`);

  // ── 1. Ambil gambar fisik dari URL ──────────────────────────────────────────
  let imageBlob: Blob;
  try {
    console.log(`[ML Request] 📥 Mengunduh gambar dari storage...`);
    const imgRes = await fetch(imageUrl, { signal: combinedSignal });
    if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
    imageBlob = await imgRes.blob();
  } catch (err) {
    console.error(`[ML Error] ❌ Gagal mengunduh gambar dari URL:`, err);
    throw new MLServiceError("Gagal menyiapkan gambar untuk analisis AI.");
  }

  // ── 2. Siapkan FormData (Persis seperti Postman) ──────────────────────────
  const formData = new FormData();
  // Key harus "file", nama file bisa di-hardcode karena hanya untuk dibaca AI
  formData.append("file", imageBlob, "image.jpg");

  console.log(`[ML Request] 📤 Mengirim file ke HF Space...`);
  const startTime = performance.now();

  let res: Response;
  try {
    // ── 3. Kirim ke Model ML ────────────────────────────────────────────────
    res = await fetch(endpoint, {
      method: "POST",
      body: formData,
      // Catatan: Jangan set "Content-Type", biarkan browser/Node.js yang mengatur
      // boundary multipart/form-data secara otomatis.
      signal: combinedSignal,
    });
  } catch (err) {
    console.error(`[ML Error] ❌ Gagal menghubungi server ML:`, err);
    if (err instanceof Error && err.name === "AbortError") {
      throw new MLServiceError("Analisis dibatalkan (Timeout).");
    }
    throw new MLServiceError(
      `Tidak dapat menjangkau ML service: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  const duration = (performance.now() - startTime).toFixed(2);
  console.log(`[ML Response] ⏱️ Waktu     : ${duration} ms`);
  console.log(`[ML Response] 📡 Status    : ${res.status} ${res.statusText}`);

  if (!res.ok) {
    throw new MLServiceError(
      `ML service error: ${res.status} ${res.statusText}`,
      res.status,
    );
  }

  let raw: MLDetectResponse & { message?: string }; // Mengakomodasi format error
  try {
    raw = await res.json();
    console.log(`[ML Response] 🧠 Data AI   :`, JSON.stringify(raw, null, 2));
    console.log("==================================================");
  } catch {
    throw new MLServiceError("Response dari ML service bukan JSON yang valid.");
  }

  // ── 4. Perbaikan Logika Validasi ──────────────────────────────────────────

  if (typeof raw.is_road !== "boolean") {
    throw new MLServiceError(
      "Response ML tidak valid: field 'is_road' hilang.",
    );
  }

  // Tolak langsung jika bukan foto jalan (kupu-kupu.avif case)
  // Di sini model tidak akan mengembalikan 'image_severity'
  if (!raw.is_road) {
    throw new MLNotRoadError(); // Pastikan class ini sudah kamu buat/import
  }

  // Jika is_road === true, baru kita wajibkan adanya image_severity
  if (typeof raw.image_severity !== "string") {
    throw new MLServiceError(
      "Response ML tidak valid: field 'image_severity' hilang pada foto jalan.",
    );
  }

  const urgency = SEVERITY_MAP[raw.image_severity] ?? null;
  const isDamageDetected = urgency !== null && raw.total_potholes > 0;

  let overallConfidence: number | null = null;

  if (raw.detections && raw.detections.length > 0) {
    // Jumlahkan semua nilai confidence dari array
    const sumConfidence = raw.detections.reduce(
      (sum, det) => sum + det.confidence,
      0,
    );
    // Cari rata-rata
    const avgConfidence = sumConfidence / raw.detections.length;
    // Ubah desimal (0.9407) menjadi persentase bulat (94)
    overallConfidence = Math.round(avgConfidence * 100);
  } else {
    overallConfidence = null;
  }

  return {
    isDamageDetected,
    totalPotholes: raw.total_potholes,
    urgency,
    rawSeverity: raw.image_severity,
    detections: raw.detections ?? [],
    overallConfidence,
  };
}
