import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

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
    <div className="flex w-full items-center justify-between pt-4 md:pt-6 border-t border-foreground/20">
      {/* Dots Indicator */}
      <div className="flex gap-1.5 md:gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
              index === currentStepIndex
                ? "w-6 md:w-8 bg-primary"
                : "w-1.5 md:w-2 bg-foreground/30"
            }`}
          />
        ))}
      </div>

      {/* Action Buttons menggunakan Shadcn */}
      <div className="flex gap-2 md:gap-3">
        {!isFirstStep && !isLastStep && (
          <Button
            onClick={onBack}
            className="px-4 py-2 h-9 md:h-10 text-xs md:text-sm bg bg-primary hover:bg-primary/90"
          >
            <ArrowLeftIcon size={14} className="mr-1.5" /> Kembali
          </Button>
        )}

        {!isLastStep ? (
          <Button
            onClick={onNext}
            className="px-4 py-2 h-9 md:h-10 text-xs md:text-sm bg-primary hover:bg-primary/90"
          >
            Selanjutnya <ArrowRightIcon size={14} className="ml-1.5" />
          </Button>
        ) : (
          <div className="flex gap-2 w-full flex-row">
            <Button
              variant="outline"
              onClick={onLogin}
              className=" h-9 md:h-10 text-xs md:text-sm px-4"
            >
              Masuk
            </Button>
            <Button
              onClick={onFinish}
              className="bg-primary hover:bg-primary-80 h-9 md:h-10 text-xs md:text-sm px-4"
            >
              Mulai Sekarang
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
