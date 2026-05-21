import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, LogIn, Rocket } from "lucide-react";

type NavigatorProps = {
  currentStepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onFinish: () => void;
  onLogin: () => void;
};

export default function StepNavigator({
  currentStepIndex,
  totalSteps,
  onNext,
  onBack,
  onFinish,
  onLogin,
}: NavigatorProps) {
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <div className="flex w-full items-center justify-between pt-4 md:pt-5 border-t border-foreground/10">
      {/* Dots */}
      <div className="flex gap-1.5 items-center">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={[
              "rounded-full transition-all duration-300 ease-out",
              i === currentStepIndex
                ? "w-5 md:w-6 h-1.5 bg-primary"
                : i < currentStepIndex
                  ? "w-1.5 h-1.5 bg-primary/40"
                  : "w-1.5 h-1.5 bg-foreground/20",
            ].join(" ")}
          />
        ))}
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        {!isFirstStep && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="h-9 px-3 text-foreground/50 hover:text-foreground gap-1.5"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline text-sm">Kembali</span>
          </Button>
        )}

        {!isLastStep ? (
          <Button
            onClick={onNext}
            size="sm"
            className="h-9 px-5 text-sm gap-1.5 bg-primary hover:bg-primary/90"
          >
            Lanjut
            <ArrowRight size={14} />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onLogin}
              className="h-9 px-4 text-sm gap-1.5"
            >
              <LogIn size={13} />
              Masuk
            </Button>
            <Button
              size="sm"
              onClick={onFinish}
              className="h-9 px-4 text-sm gap-1.5 bg-primary hover:bg-primary/90"
            >
              <Rocket size={13} />
              Mulai
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
