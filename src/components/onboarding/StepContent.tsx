// ── SVG Illustrations ─────────────────────────────────────────────────────────

import { OnboardingStep } from "@/data/onboardingData";
import {
  IllustrationReport,
  IllustrationAI,
  IllustrationImpact,
} from "./ilustrationSvg";

const ILLUSTRATIONS = {
  report: IllustrationReport,
  ai: IllustrationAI,
  impact: IllustrationImpact,
};

// ── StepContent ───────────────────────────────────────────────────────────────

export default function StepContent({ step }: { step: OnboardingStep }) {
  const Illustration = ILLUSTRATIONS[step.visual];

  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-6 md:gap-14 items-center justify-center">
      {/* Illustration */}
      <div className="w-full md:w-1/2 flex justify-center items-center shrink-0">
        <div className="relative w-full max-w-65 md:max-w-[320px] aspect-280/220">
          {/* Soft glow behind illustration */}
          <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-2xl scale-110" />
          <div className="relative w-full h-full">
            <Illustration />
          </div>
        </div>
      </div>

      {/* Text */}
      <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
        {/* Step label */}
        <div className="inline-flex items-center justify-center md:justify-start gap-2 mb-3">
          <span className="h-px w-6 bg-primary/40 hidden md:block" />
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-primary/70">
            {step.subtitle}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight tracking-tight mb-3 md:mb-4">
          {step.title}
        </h2>

        <p className="text-sm md:text-base text-foreground/60 leading-relaxed mb-5 md:mb-6 max-w-md mx-auto md:mx-0">
          {step.description}
        </p>

        {step.listItems && (
          <div className="flex flex-col gap-2.5 max-w-md mx-auto md:mx-0 w-full">
            {step.listItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/6 border border-primary/10"
              >
                <span className="text-base shrink-0">
                  <item.icon color="rgba(30,122,61,1)" />
                </span>
                <p className="text-xs md:text-sm text-foreground/70 leading-snug text-left">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
