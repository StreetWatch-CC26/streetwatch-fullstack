"use client";

/**
 * app/dashboard/playground/page.tsx
 *
 * Halaman StreetWatch AI Playground.
 * Alur: Upload → Analyze → Hasil + CTA Buat Laporan
 */

import React from "react";
import { Sparkles, RotateCcw, ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ScannerOverlay,
  PhaseStepBar,
} from "@/components/playground/ScannerOverlay";
import { ImageDropzone } from "@/components/playground/ImageDropzone";
import { AnalysisResultCard } from "@/components/playground/AnalysisResultCard";
import { useAnalysis } from "@/hooks/useAnalysis";

export default function PlaygroundPage() {
  const { file, preview, phase, result, errorMsg, loadImage, analyze, reset } =
    useAnalysis();

  const isAnalyzing =
    phase === "reading" || phase === "uploading" || phase === "analyzing";

  const isDone = phase === "done";
  const isError = phase === "error";

  return (
    <div className="flex flex-col h-[calc(100dvh-156px)] sm:h-[calc(100dvh-65px)] overflow-hidden">
      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                StreetWatch AI
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Upload foto kondisi jalan. AI akan mendeteksi kerusakan, menilai
                tingkat keparahan, dan memberikan rekomendasi tindak lanjut.
              </p>
            </div>
          </div>

          {/* ── Upload / Preview area ── */}
          {!preview ? (
            <ImageDropzone
              preview={null}
              fileName={null}
              onFile={loadImage}
              onReset={reset}
            />
          ) : isAnalyzing ? (
            /* Scanner animation while processing */
            <div className="space-y-3">
              <ScannerOverlay phase={phase} preview={preview} />
              <PhaseStepBar phase={phase} />
            </div>
          ) : (
            /* Static preview after done/idle */
            <ImageDropzone
              preview={preview}
              fileName={file?.name ?? null}
              disabled={isAnalyzing}
              onFile={loadImage}
              onReset={reset}
            />
          )}

          {/* ── Analyze CTA (before result) ── */}
          {preview && !isDone && !isAnalyzing && !isError && (
            <Button className="w-full gap-2" size="lg" onClick={analyze}>
              <ScanSearch className="w-4 h-4" />
              Analisis Gambar
              <Sparkles className="w-3.5 h-3.5 ml-auto opacity-70" />
            </Button>
          )}

          {/* ── Error state ── */}
          {isError && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-3 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-destructive text-sm font-bold">!</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-destructive">
                  Analisis Gagal
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {errorMsg}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={reset}
                className="shrink-0 text-xs gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Coba lagi
              </Button>
            </div>
          )}

          {/* ── Result card ── */}
          {isDone && result && (
            <AnalysisResultCard
              result={
                result as React.ComponentProps<
                  typeof AnalysisResultCard
                >["result"]
              }
            />
          )}

          {/* ── Reset after done ── */}
          {isDone && (
            <Button
              variant="outline"
              className="w-full gap-1.5 text-xs"
              onClick={reset}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Analisis Gambar Lain
            </Button>
          )}

          {/* ── How it works (shown when idle) ── */}
          {!preview && (
            <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-3">
              <p className="text-xs font-semibold text-foreground">
                Cara Kerja
              </p>
              {[
                { n: "01", text: "Upload foto jalan yang terlihat rusak" },
                {
                  n: "02",
                  text: "AI memindai dan mengklasifikasikan jenis kerusakan",
                },
                {
                  n: "03",
                  text: "Lihat skor, tingkat urgensi, dan rekomendasi",
                },
                {
                  n: "04",
                  text: "Langsung buat laporan — data otomatis terisi",
                },
              ].map((s) => (
                <div key={s.n} className="flex items-start gap-3">
                  <span className="font-mono text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                    {s.n}
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
