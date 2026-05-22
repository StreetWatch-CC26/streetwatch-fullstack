// hooks/useAnalysis.ts
"use client";

import { useState, useCallback } from "react";
import type { AnalysisPhase, AnalysisResult } from "@/data/analysisSchema";
import { RECOMMENDATIONS } from "@/data/analysisSchema";
import { useAnalysisStore } from "@/stores/analysis.store";
import type { MLAnalysisResult } from "@/services/ml.service";

const MAX_SIZE_MB = 10;

export function useAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [phase, setPhase] = useState<AnalysisPhase>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { setAnalysis } = useAnalysisStore();

  const loadImage = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) {
      setErrorMsg("File harus berupa gambar (JPG, PNG, WEBP).");
      setPhase("error");
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`Ukuran maksimal ${MAX_SIZE_MB} MB.`);
      setPhase("error");
      return;
    }

    setFile(f);
    setResult(null);
    setErrorMsg(null);
    setPhase("idle");

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const analyze = useCallback(async () => {
    if (!file || !preview) return;
    setResult(null);
    setErrorMsg(null);

    try {
      // 1. Upload Gambar
      setPhase("uploading");
      const fd = new FormData();
      fd.append("image", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });
      const uploadJson = await uploadRes.json();

      if (!uploadRes.ok)
        throw new Error(uploadJson.message || "Gagal mengunggah gambar.");
      const imageUrl = uploadJson.data.url;

      // 2. Analisis via ML
      setPhase("analyzing");
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });
      const analyzeJson = await analyzeRes.json();

      if (!analyzeRes.ok)
        throw new Error(analyzeJson.message || "Analisis gagal.");

      const mlData = analyzeJson.data as MLAnalysisResult;

      // 3. Gabungkan hasil ML dengan rekomendasi lokal
      const finalResult: AnalysisResult = {
        ...mlData,
        recommendations: mlData.urgency ? RECOMMENDATIONS[mlData.urgency] : [],
      };

      setPhase("done");
      setResult(finalResult);
      setAnalysis(finalResult, preview, file.name);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal mengirim laporan.";

      setErrorMsg(message || "Terjadi kesalahan sistem.");
      setPhase("error");
    }
  }, [file, preview, setAnalysis]);

  const reset = useCallback(() => {
    setFile(null);
    setPreview(null);
    setPhase("idle");
    setResult(null);
    setErrorMsg(null);
  }, []);

  return { file, preview, phase, result, errorMsg, loadImage, analyze, reset };
}
