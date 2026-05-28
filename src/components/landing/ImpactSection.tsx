import { Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Budi Santoso",
    role: "Warga Pekanbaru",
    initials: "BS",
    quote:
      "Saya laporkan lubang di jalan depan rumah, 3 hari kemudian ada petugas yang datang. Sebelumnya sudah setahun nunggu!",
  },
  {
    name: "Ir. Dewi Rahayu",
    role: "Kepala Dinas PU Kota Medan",
    initials: "DR",
    quote:
      "StreetWatch membantu kami memprioritaskan perbaikan dengan data yang akurat. Efisiensi anggaran meningkat signifikan.",
  },
  {
    name: "Andi Pratama",
    role: "Koordinator Komunitas Surabaya",
    initials: "AP",
    quote:
      "Platform ini benar-benar menjembatani warga dan pemerintah. Transparansi prosesnya luar biasa.",
  },
];

const impactNumbers = [
  { value: "1000+", label: "Laporan Diterima" },
  { value: "950+", label: "Jalan Diperbaiki" },
  { value: "18", label: "Kota Aktif" },
  { value: "4.2 Hari", label: "Rata-rata Respons" },
];

export function ImpactSection() {
  return (
    <section id="impact" className="py-24 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Dampak Nyata
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            Ribuan jalan lebih aman,
            <br className="hidden sm:block" />
            berkat komunitas
          </h2>
        </div>

        {/* Impact numbers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {impactNumbers.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-card p-6 text-center hover:border-primary/30 transition-colors"
            >
              <div className="font-heading text-3xl lg:text-4xl font-bold text-primary mb-1">
                {item.value}
              </div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4 hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <Quote className="w-6 h-6 text-primary/40" />
              <p className="text-sm text-foreground leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <Avatar className="w-9 h-9">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
