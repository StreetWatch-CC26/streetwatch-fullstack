import { Target, Eye, Heart } from "lucide-react";

const pillars = [
  {
    icon: Target,
    title: "Misi",
    content:
      "Mempercepat perbaikan infrastruktur jalan di Indonesia melalui teknologi AI, transparansi data, dan kolaborasi nyata antara warga dengan pemerintah.",
  },
  {
    icon: Eye,
    title: "Visi",
    content:
      "Indonesia dengan jalan yang aman, terdata, dan terkelola dengan baik — di mana setiap laporan warga didengar dan ditindaklanjuti dalam waktu nyata.",
  },
  {
    icon: Heart,
    title: "Nilai",
    content:
      "Transparansi dalam setiap proses, akuntabilitas berbasis data, dan inklusivitas — karena jalan yang rusak berdampak pada semua lapisan masyarakat.",
  },
];

export function MissionSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Story */}
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-5">
              Cerita Kami
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-6 leading-tight">
              Dimulai dari satu lubang jalan dan sebuah pertanyaan sederhana.
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Pada 2025, salah satu pendiri kami, Firza mengalami kecelakaan
                ringan akibat lubang jalan di ketika pulang dari KKN. Ia melapor
                ke kelurahan, lalu ke dinas PU. Tiga bulan berlalu. Tidak ada
                respons, tidak ada perbaikan.
              </p>
              <p>
                Ia bertanya:{" "}
                <em className="text-foreground font-medium">
                  &quot;Apakah ada cara yang lebih baik?&quot;
                </em>
              </p>
              <p>
                Bersama tim kecil dari Coding Camp 2026, Firza mulai membangun
                prototipe pertama StreetWatch, sebuah form sederhana yang
                mengirim foto kerusakan jalan langsung ke email kepala dinas.
                Dalam dua minggu, lubang itu ditambal.
              </p>
              <p>
                Dari satu lubang, kami berkembang menjadi platform yang kini
                menjangkau beberapa kota dengan ribuan laporan terproses.
                Perjalanan ini baru dimulai.
              </p>
            </div>

            {/* Timeline mini */}
            <div className="mt-10 space-y-4">
              {[
                {
                  year: "2026",
                  event: "Prototipe pertama diluncurkan",
                },
                // {
                //   year: "2026",
                //   event: "Ekspansi ke 12 kota, MoU dengan 8 dinas PU",
                // },
                // {
                //   year: "2025",
                //   event: "18 kota aktif, model AI v2.0, 2.400+ laporan",
                // },
              ].map((item) => (
                <div key={item.year} className="flex items-start gap-4">
                  <div className="w-14 shrink-0">
                    <span className="text-xs font-mono font-bold text-primary">
                      {item.year}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      {item.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Misi / Visi / Nilai */}
          <div className="space-y-5">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <pillar.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {pillar.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Stat highlight */}
            <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
              <div className="font-heading text-4xl font-bold mb-1">75%</div>
              <div className="text-sm text-primary-foreground/80 leading-relaxed">
                laporan terverifikasi di StreetWatch mendapat respons dari
                pemerintah daerah dalam{" "}
                <strong className="text-primary-foreground">
                  7 hari kerja
                </strong>{" "}
                — jauh di atas rata-rata nasional.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
