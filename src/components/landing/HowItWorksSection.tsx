import { Camera, Cpu, MapPinCheck, Binoculars } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Camera,
    step: "01",
    title: "Foto & Laporkan",
    description:
      "Warga memotret kerusakan jalan dan menguploadnya melalui aplikasi web atau mobile. Lokasi GPS otomatis terdeteksi.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "Analisis AI",
    description:
      "Model AI kami mengklasifikasikan tingkat kerusakan (parah, medium, ringan) dalam hitungan detik.",
  },
  {
    icon: MapPinCheck,
    step: "03",
    title: "Verifikasi & Prioritas",
    description:
      "Laporan masuk ke dashboard admin, diurutkan otomatis berdasarkan urgensi dan kepadatan lalu lintas (opsional).",
  },
  {
    icon: Binoculars,
    step: "04",
    title: "Pantau Perkembangan",
    description:
      "Sistem otomatis mengirimkan laporan kepada pemerintah setempat dan warga dapat melihat perkembangan pada peta interaktif.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-16 md:py-24 lg:py-32 px-5 md:px-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Cara Kerja
          </p>
          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Dari laporan ke perbaikan,
            <br className="block" />
            dalam 4 langkah
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="hidden lg:block absolute top-12 left-[calc(12.5%-1px)] right-[calc(12.5%-1px)] h-px bg-linear-to-r from-transparent via-border to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {steps.map((step) => (
              <div
                key={step.step}
                className="group relative flex flex-col items-center text-center border border-border rounded-2xl p-6 hover:border-primary/40 transition-all duration-300"
              >
                {/* Icon circle */}
                <div
                  className={cn(
                    "relative z-10 w-16 sm:w-24 h-16 sm:h-24 rounded-2xl flex flex-col items-center justify-center mb-4 sm:mb-5 border-2 transition-all duration-300",
                    "bg-card border-border group-hover:border-primary/60 group-hover:bg-primary/5",
                  )}
                >
                  <step.icon className="w-6 sm:w-7 h-6 sm:h-7 text-primary mb-1" />
                  <span className="text-[10px] font-bold text-muted-foreground font-mono">
                    {step.step}
                  </span>
                </div>

                {/* Content Box */}
                <h3 className="font-heading text-base sm:text-lg font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-62.5">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
