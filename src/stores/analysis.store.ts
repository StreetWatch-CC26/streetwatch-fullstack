"use client";

/**
 * stores/playground.store.ts
 *
 * Zustand store — menjembatani hasil analisis dari Playground
 * ke halaman Buat Laporan tanpa re-analyze.
 *
 * Persisted di sessionStorage sehingga data tetap ada saat
 * user navigasi ke /dashboard/reports/new.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AnalysisResult } from "@/data/analysisSchema";

interface AnalysisStore {
  /** Hasil analisis terakhir */
  result: AnalysisResult | null;

  /** Base64 preview gambar yang dianalisis */
  imagePreview: string | null;

  /** File name asli */
  imageName: string | null;

  /** Actions */
  setAnalysis: (
    result: AnalysisResult,
    imagePreview: string,
    imageName: string,
  ) => void;
  clear: () => void;
}

export const useAnalysisStore = create<AnalysisStore>()(
  persist(
    (set) => ({
      result: null,
      imagePreview: null,
      imageName: null,

      setAnalysis: (result, imagePreview, imageName) =>
        set({ result, imagePreview, imageName }),

      clear: () => set({ result: null, imagePreview: null, imageName: null }),
    }),
    {
      name: "sw-analysis",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
