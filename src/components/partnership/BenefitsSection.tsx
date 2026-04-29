import {
  BarChart3,
  Clock,
  FileText,
  Globe,
  ShieldCheck,
  Headphones,
} from "lucide-react";

const benefits = [
  {
    icon: BarChart3,
    title: "Pengambilan Keputusan Berbasis Data",
    description:
      "Dashboard analitik real-time membantu dinas PU mengidentifikasi titik paling kritis dan mengalokasikan anggaran secara lebih efisien.",
  },
  {
    icon: Clock,
    title: "Respons Lebih Cepat",
    description:
      "Mitra pemerintah kami rata-rata memangkas waktu respons dari 45 hari menjadi 7 hari kerja berkat sistem triase otomatis.",
  },
  {
    icon: FileText,
    title: "Dokumentasi Otomatis",
    description:
      "Laporan dan dokumentasi perbaikan jalan tergenerate otomatis dalam format yang siap digunakan untuk pelaporan APBD.",
  },
  {
    icon: Globe,
    title: "Transparansi Publik",
    description:
      "Warga dapat memantau progress perbaikan secara langsung, meningkatkan kepercayaan publik terhadap pemerintah daerah.",
  },
  {
    icon: ShieldCheck,
    title: "Kepatuhan & Keamanan Data",
    description:
      "Platform kami memenuhi standar keamanan data pemerintah dan PDPA Indonesia, dengan hosting lokal di data center Indonesia.",
  },
  {
    icon: Headphones,
    title: "Dukungan Implementasi Penuh",
    description:
      "Tim kami mendampingi dari onboarding, pelatihan staf, hingga go-live — tanpa biaya tambahan untuk paket pemerintah.",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid lg:grid-cols-[360px_1fr] gap-16 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">
              Mengapa Bermitra
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight mb-5">
              Nilai yang kami
              bawa untuk mitra.
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Bukan sekadar perangkat lunak — kami adalah mitra strategis yang
              berkomitmen pada keberhasilan transformasi digital layanan publik kamu.
            </p>

            {/* Quote block */}
            <div className="mt-8 rounded-2xl bg-muted/50 border border-border p-5">
              <p className="text-sm text-foreground italic leading-relaxed mb-3">
                "Implementasi StreetWatch mengubah cara kerja dinas kami secara
                fundamental. Sekarang kami bisa justifikasi anggaran perbaikan
                jalan dengan data yang solid."
              </p>
              <div className="text-xs text-muted-foreground font-medium">
                — Kepala Dinas PU, Kota Batam
              </div>
            </div>
          </div>

          {/* Benefits grid */}
          <div className="grid sm:grid-cols-2 gap-5">
            {benefits.map((benefit, i) => (
              <div
                key={benefit.title}
                className="group rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-base font-bold text-foreground mb-2 leading-tight">
                  {benefit.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
