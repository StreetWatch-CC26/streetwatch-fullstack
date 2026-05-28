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
    <section id="how-it-works" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Cara Kerja
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Dari laporan ke perbaikan,
            <br className="block" />
            dalam 4 langkah
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden sm:block absolute top-13 left-[calc(12.5%-1px)] right-[calc(12.5%-1px)] h-px bg-linear-to-r from-transparent via-border to-transparent" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step) => (
              <div
                key={step.step}
                className="relative flex flex-col items-center text-center lg:items-center"
              >
                {/* Icon circle */}
                <div
                  className={cn(
                    "relative z-10 w-18 sm:w-24 h-18 sm:h-24 rounded-2xl flex flex-col items-center justify-center mb-5 border-2 transition-all duration-300",
                    "bg-card border-border hover:border-primary/60 hover:bg-primary/5 group",
                  )}
                >
                  <step.icon className="w-7 h-7 text-primary mb-1" />
                  <span className="text-[10px] font-bold text-muted-foreground font-mono">
                    {step.step}
                  </span>
                </div>

                <h3 className="font-heading textbase sm:text-lg font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-55">
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
