import { ArrowRight } from "lucide-react";
import Link from "next/link";

const caseStudies = [
  {
    city: "Kota Pekanbaru",
    province: "Riau",
    tag: "Pemerintah Kota",
    headline: "Dari 45 hari ke 6 hari rata-rata respons perbaikan jalan.",
    metrics: [
      { value: "87%", label: "Penurunan waktu respons" },
      { value: "340+", label: "Laporan terproses" },
      { value: "Rp 2.1M", label: "Efisiensi anggaran" },
    ],
    quote:
      "StreetWatch mengubah cara kami bekerja — bukan hanya digitalisasi, tapi transformasi nyata.",
    person: "Kepala Dinas PU Kota Pekanbaru",
  },
  {
    city: "Kota Batam",
    province: "Kepri",
    tag: "BPJN",
    headline: "Pemetaan 1.200 km jalan nasional dalam 3 bulan pertama.",
    metrics: [
      { value: "1.200 km", label: "Jalan terpetakan" },
      { value: "98%", label: "Akurasi koordinat GPS" },
      { value: "60%", label: "Lebih cepat dari manual" },
    ],
    quote:
      "Data yang dihasilkan StreetWatch menjadi basis perencanaan rehabilitasi jalan kami.",
    person: "Koordinator BPJN Kepri",
  },
];

export function CaseStudiesSection() {
  return (
    <section className="py-16 md:py-24 lg:py-32 px-5 md:px-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">
            Studi Kasus
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Hasil nyata dari mitra kami.
            </h2>
            <Link
              href="#"
              className="text-sm font-semibold text-primary hover:underline underline-offset-4 flex items-center gap-1 shrink-0"
            >
              Lihat semua studi kasus <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-3 md:gap-6">
          {caseStudies.map((cs) => (
            <div
              key={cs.city}
              className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col"
            >
              {/* Card header */}
              <div className="bg-primary/5 border-b border-border px-6 py-4 flex items-center justify-between">
                <div>
                  <div className="font-heading font-bold text-foreground">
                    {cs.city}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {cs.province}
                  </div>
                </div>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {cs.tag}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-heading text-xl font-bold text-foreground leading-tight mb-5">
                  {cs.headline}
                </h3>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {cs.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl bg-muted/50 p-3 text-center"
                    >
                      <div className="font-heading text-lg font-bold text-primary leading-none mb-1">
                        {m.value}
                      </div>
                      <div className="text-xs text-muted-foreground leading-tight">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quote */}
                <div className="flex-1 rounded-xl border border-border bg-background/50 p-4">
                  <p className="text-sm text-foreground italic leading-relaxed mb-2">
                    &ldquo;{cs.quote}&rdquo;
                  </p>
                  <div className="text-xs text-muted-foreground font-medium">
                    — {cs.person}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
