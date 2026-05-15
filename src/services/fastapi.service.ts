// src/services/fastapi.service.ts

export interface FastAPIAnalysisResult {
  is_damage_detected: boolean;
  category: string;
  urgency: string;
  level: string;
  score: number;
  summary: string;
  recommendations: string[];
}

export async function analyzeImageWithFastAPI(
  imageUrl: string,
): Promise<FastAPIAnalysisResult> {
  // Simulasi waktu proses ML (misal: 2 detik)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log(`[MOCK FastAPI] Menganalisis gambar: ${imageUrl}`);

  // Mengembalikan data mock statis yang formatnya sesuai dengan kontrak API
  return {
    is_damage_detected: true,
    category: "lubang",
    urgency: "high",
    level: "tinggi",
    score: 87.5, // Skor konfidensi AI
    summary:
      "Terdeteksi lubang pada permukaan aspal dengan kedalaman yang berpotensi membahayakan pengendara roda dua, terutama saat malam hari atau hujan.",
    recommendations: [
      "Lakukan penambalan sementara segera",
      "Pasang rambu peringatan di sekitar lokasi",
      "Periksa sistem drainase di sekitar jalan yang rusak",
    ],
  };
}
