import { BrainCircuit, Map, BarChart3, Users, FileCheck } from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "Deteksi AI Otomatis",
    description:
      "Model computer vision kami mengidentifikasi jenis dan tingkat keparahan kerusakan jalan dari foto yang diunggah pengguna secara instan.",
  },
  {
    icon: Map,
    title: "Peta Kerusakan Real-time",
    description:
      "Visualisasi interaktif seluruh laporan aktif di wilayahmu. Filter berdasarkan status, keparahan, atau waktu laporan.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Analitik",
    description:
      "Pemerintah daerah mendapat insight berbasis data berupa tren kerusakan, prioritas wilayah, dan performa tim lapangan.",
  },
  {
    icon: Users,
    title: "Kolaborasi Warga & Pemerintah",
    description:
      "Jembatan langsung antara pelapor, verifikator komunitas, dan dinas PU untuk alur kerja yang transparan.",
  },
  {
    icon: FileCheck,
    title: "Laporan & Ekspor Data",
    description:
      "Generate laporan PDF/Excel otomatis untuk kebutuhan perencanaan anggaran dan dokumentasi resmi.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Fitur Platform
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Semua yang dibutuhkan untuk
            <br className="block" />
            infrastruktur yang lebih baik
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            StreetWatch mengintegrasikan AI, pemetaan, dan manajemen laporan
            dalam satu platform yang mudah digunakan.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              {/* Number */}
              <span className="absolute top-6 right-5 text-2xl lg:text-4xl font-heading font-bold text-secondary select-none">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="w-9 sm:w-11 h-9 sm:h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>

              <h3 className="font-heading text-base sm:text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
