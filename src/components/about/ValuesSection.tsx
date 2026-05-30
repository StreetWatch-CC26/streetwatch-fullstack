const values = [
  {
    number: "01",
    title: "Data Terbuka",
    description:
      "Semua data kerusakan jalan yang terkumpul bersifat publik dan dapat diakses siapapun melalui API kami. Transparansi adalah fondasi kepercayaan.",
  },
  {
    number: "02",
    title: "Privasi Pelapor",
    description:
      "Identitas pelapor dilindungi. Anda bisa memilih melaporkan secara anonim. Data pribadi tidak pernah dijual atau dibagikan ke pihak ketiga.",
  },
  {
    number: "03",
    title: "Akuntabilitas Terukur",
    description:
      "Setiap laporan memiliki status yang dapat dilacak. Pemerintah yang menggunakan StreetWatch terikat pada SLA respons yang termonitor publik.",
  },
  {
    number: "04",
    title: "Inklusif Tanpa Syarat",
    description:
      "Platform dirancang untuk semua — dari warga desa hingga pejabat kota. Tidak ada biaya untuk melapor, tidak ada hambatan teknis yang tidak perlu.",
  },
];

export function ValuesSection() {
  return (
    <section className="py-16 md:py-24 lg:py-32 px-5 md:px-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 md:gap-16 items-start">
          {/* Sticky label */}
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">
              Prinsip Kami
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight">
              Nilai yang tidak pernah kami kompromikan.
            </h2>
          </div>

          {/* Values list */}
          <div className="divide-y divide-border">
            {values.map((value) => (
              <div
                key={value.number}
                className="group py-4 md:py-8 grid sm:grid-cols-[80px_1fr] gap-2 md:gap-4 hover:bg-muted/30 -mx-4 px-4 rounded-xl transition-colors duration-200"
              >
                <div className="font-mono text-xl md:text-3xl font-bold text-muted/50 group-hover:text-primary/30 transition-colors pt-1">
                  {value.number}
                </div>
                <div>
                  <h3 className="font-heading text-base md:text-xl font-bold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
