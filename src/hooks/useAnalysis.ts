"use client";

/**
 * hooks/useAnalysis.ts
 *
 * Orkestrasi lengkap:
 * 1. Terima file gambar dari user
 * 2. Baca sebagai base64
 * 3. Jalankan mock analysis dengan phase tracking
 * 4. Simpan hasil ke Zustand store
 */

import { useState, useCallback } from "react";
import {
  runMockAnalysis,
  type AnalysisPhase,
  type AnalysisResult,
} from "@/data/analysisSchema";
import { useAnalysisStore } from "@/stores/analysis.store";

export type { AnalysisPhase };

interface UseAnalysis {
  /** Currently loaded image file */
  file: File | null;
  /** Object URL / base64 preview for <img> */
  preview: string | null;
  /** Current processing phase */
  phase: AnalysisPhase;
  /** Final analysis result (null until done) */
  result: AnalysisResult | null;
  /** Error message if phase === "error" */
  errorMsg: string | null;

  /** Load a new image (does not auto-analyze) */
  loadImage: (f: File) => void;
  /** Start analysis on loaded image */
  analyze: () => Promise<void>;
  /** Reset everything */
  reset: () => void;
}

const MAX_SIZE_MB = 10;

export function useAnalysis(): UseAnalysis {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [phase, setPhase] = useState<AnalysisPhase>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { setAnalysis } = useAnalysisStore();

  // ── Load image file ──────────────────────────────────────────────────────────
  const loadImage = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) {
      setErrorMsg("File harus berupa gambar (JPG, PNG, WEBP).");
      setPhase("error");
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`Ukuran gambar maksimal ${MAX_SIZE_MB} MB.`);
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

  // ── Run analysis ─────────────────────────────────────────────────────────────
  const analyze = useCallback(async () => {
    if (!file || !preview) return;
    setResult(null);
    setErrorMsg(null);

    try {
      const res = await runMockAnalysis(preview, setPhase);
      setResult(res);
      // Persist to store so report/new can consume without re-analyze
      setAnalysis(res, preview, file.name);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err?.message ?? "Analisis gagal. Coba lagi.");
      } else {
        console.log("Terjadi error yang tidak diketahui", err);
      }
      setPhase("error");
    }
  }, [file, preview, setAnalysis]);

  // ── Reset ────────────────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setFile(null);
    setPreview(null);
    setPhase("idle");
    setResult(null);
    setErrorMsg(null);
  }, []);

  return { file, preview, phase, result, errorMsg, loadImage, analyze, reset };
}
