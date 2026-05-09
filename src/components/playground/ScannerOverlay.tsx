"use client";

/**
 * components/playground/ScannerOverlay.tsx
 *
 * Animasi scanner yang muncul di atas gambar saat analisis berjalan.
 * + Indicator bar fasa di bawah gambar.
 */

import { PHASE_LABEL, type AnalysisPhase } from "@/data/analysisSchema";
import { cn } from "@/lib/utils";

const PHASES: AnalysisPhase[] = ["reading", "scanning", "classifying", "done"];

interface Props {
  phase: AnalysisPhase;
  preview: string;
}

export function ScannerOverlay({ phase, preview }: Props) {
  const isActive = phase !== "idle" && phase !== "done" && phase !== "error";
  const currentIdx = PHASES.indexOf(phase);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-border relative">
      {/* Image */}
      <img
        src={preview}
        alt="Gambar dianalisis"
        className={cn(
          "w-full max-h-72 object-cover transition-all duration-500",
          isActive && "brightness-75",
        )}
      />

      {/* Scanner beam */}
      {isActive && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Scan line */}
          <div
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-90"
            style={{ animation: "scanLine 1.6s ease-in-out infinite" }}
          />
          {/* Corner brackets */}
          {[
            "top-3 left-3 border-t-2 border-l-2 rounded-tl-lg",
            "top-3 right-3 border-t-2 border-r-2 rounded-tr-lg",
            "bottom-3 left-3 border-b-2 border-l-2 rounded-bl-lg",
            "bottom-3 right-3 border-b-2 border-r-2 rounded-br-lg",
          ].map((cls, i) => (
            <div
              key={i}
              className={cn("absolute w-5 h-5 border-primary", cls)}
            />
          ))}
          {/* Overlay grid */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--primary) 1px, transparent 1px), linear-gradient(to bottom, var(--primary) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          {/* Phase label */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border text-xs font-medium text-primary font-mono">
            {PHASE_LABEL[phase]}
          </div>
        </div>
      )}

      {/* Scanline keyframes injected inline */}
      <style>{`
        @keyframes scanLine {
          0%   { top: 0%; }
          50%  { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
}

// ── Phase step indicator bar ──────────────────────────────────────────────────

export function PhaseStepBar({ phase }: { phase: AnalysisPhase }) {
  const steps = [
    { key: "reading", label: "Baca" },
    { key: "scanning", label: "Pindai" },
    { key: "classifying", label: "Klasifikasi" },
    { key: "done", label: "Selesai" },
  ] as const;

  const currentIdx = steps.findIndex((s) => s.key === phase);

  return (
    <div className="flex items-center gap-1 w-full">
      {steps.map((step, i) => {
        const done = currentIdx > i;
        const active = currentIdx === i;
        return (
          <div key={step.key} className="flex-1 flex flex-col gap-1">
            <div
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                done
                  ? "bg-primary"
                  : active
                    ? "bg-primary/50 animate-pulse"
                    : "bg-muted",
              )}
            />
            <span
              className={cn(
                "text-[9px] font-mono text-center transition-colors",
                done || active ? "text-primary" : "text-muted-foreground/50",
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
