import { Button } from "@/components/ui/button";
import { X, Upload, BrainCircuit, CheckCircle2 } from "lucide-react";

export type SubmitStep = "uploading" | "analyzing" | "saving" | null;

const STEP_CONFIG: Record<
  Exclude<SubmitStep, null>,
  {
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    cancelable: boolean;
  }
> = {
  uploading: {
    label: "Mengupload foto…",
    sublabel: "Mengunggah gambar ke server",
    icon: <Upload className="w-5 h-5" />,
    cancelable: true,
  },
  analyzing: {
    label: "Menganalisis kerusakan…",
    sublabel: "AI sedang memvalidasi foto jalan",
    icon: <BrainCircuit className="w-5 h-5" />,
    cancelable: true,
  },
  saving: {
    label: "Menyimpan laporan…",
    sublabel: "Hampir selesai",
    icon: <CheckCircle2 className="w-5 h-5" />,
    cancelable: false,
  },
};

interface SubmitLoadingOverlayProps {
  step: Exclude<SubmitStep, null>;
  onCancel?: () => void;
}

export function SubmitLoadingOverlay({
  step,
  onCancel,
}: SubmitLoadingOverlayProps) {
  const config = STEP_CONFIG[step];
  const steps = ["uploading", "analyzing", "saving"] as const;
  const currentIndex = steps.indexOf(step);

  return (
    <div className="fixed inset-0 z-1100 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-[320px] mx-4 bg-background border border-border rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5 transform transition-transform animate-in zoom-in-95 duration-200">
        <div className="relative flex items-center justify-center">
          <span className="absolute w-16 h-16 rounded-full bg-primary/15 animate-ping duration-700" />
          <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/20 text-primary shadow-sm">
            {config.icon}
          </span>
        </div>

        <div className="text-center space-y-1.5">
          <p className="text-base font-semibold text-foreground tracking-tight">
            {config.label}
          </p>
          <p className="text-sm text-muted-foreground">{config.sublabel}</p>
        </div>

        <div className="flex items-center gap-2.5">
          {steps.map((s, i) => (
            <div
              key={s}
              className={[
                "rounded-full transition-all duration-300",
                i < currentIndex
                  ? "w-2.5 h-2.5 bg-primary"
                  : i === currentIndex
                    ? "w-3 h-3 bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                    : "w-2 h-2 bg-muted-foreground/20",
              ].join(" ")}
            />
          ))}
        </div>

        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="mt-2 gap-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
          >
            <X className="w-4 h-4" />
            Batalkan
          </Button>
        )}
      </div>
    </div>
  );
}
