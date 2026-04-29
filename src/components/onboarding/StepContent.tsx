import Image from "next/image";
import { OnboardingStep } from "./onboarding-data";

export default function StepContent({ step }: { step: OnboardingStep }) {
  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-4 md:gap-12 items-center justify-center">
      <div className="w-full md:w-1/2 flex justify-center items-center h-[35vh] md:h-auto">
        {step.imageSrc ? (
          <div className="relative w-full h-full max-h-75 max-w-75 md:max-w-sm rounded-xl overflow-hidden border bg-secondary items-center justify-center">
            <Image
              src={step.imageSrc}
              alt={step.title}
              width={600}
              height={200}
              className="object-contain p-4"
              priority
            />
          </div>
        ) : (
          <div className="w-full h-full max-h-62.5 max-w-62.5 md:max-w-sm bg-secondary rounded-xl border flex items-center justify-center text-foreground font-medium text-sm">
            [ Gambar: {step.title} ]
          </div>
        )}
      </div>

      {/* Bagian Teks (Konten) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left">
        {step.statusText && (
          <p className="text-[10px] md:text-xs font-semibold text-foreground/90 tracking-wider mb-2 md:mb-4 uppercase line-clamp-1">
            {step.statusText}
          </p>
        )}

        {/* Ukuran font diperkecil sedikit di layar HP */}
        <h2 className="text-2xl md:text-3xl font-bold text-foreground-90 mb-2 md:mb-4 leading-tight">
          {step.title}
        </h2>

        <p className="text-sm md:text-base text-foreground/70 leading-relaxed mb-4 md:mb-6">
          {step.description}
        </p>

        {/* Khusus untuk langkah terakhir (List Centang) */}
        {step.listItems && (
          <div className="flex flex-col gap-2 md:gap-3 text-left">
            {step.listItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 md:p-4 border rounded-lg bg-background/50"
              >
                <div className="mt-0.5 text-primary font-bold">✓</div>
                <p className="text-xs md:text-sm text-foreground-70 leading-tight">
                  {item}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
