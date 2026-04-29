const steps = [
  {
    number: "01",
    title: "Ajukan Formulir",
    duration: "Hari 1",
    description:
      "Isi formulir kemitraan di bawah. Tim kami akan menghubungi dalam 2×24 jam untuk diskusi kebutuhan awal.",
  },
  {
    number: "02",
    title: "Asesmen & Demo",
    duration: "Minggu 1",
    description:
      "Kami melakukan asesmen kebutuhan dan memberikan demo platform yang disesuaikan dengan konteks daerahmu.",
  },
  {
    number: "03",
    title: "MoU & Setup",
    duration: "Minggu 2–3",
    description:
      "Penandatanganan MoU, konfigurasi platform untuk wilayahmu, dan migrasi data yang ada (jika diperlukan).",
  },
  {
    number: "04",
    title: "Pelatihan Tim",
    duration: "Minggu 3–4",
    description:
      "Workshop pelatihan untuk tim teknis, operator dashboard, dan koordinator lapangan di instansimu.",
  },
  {
    number: "05",
    title: "Soft Launch",
    duration: "Bulan 2",
    description:
      "Peluncuran terbatas di satu kecamatan atau kelurahan percontohan untuk validasi alur kerja.",
  },
  {
    number: "06",
    title: "Go Live",
    duration: "Bulan 3",
    description:
      "Peluncuran penuh di seluruh wilayah. Tim kami mendampingi selama 30 hari pertama tanpa biaya tambahan.",
  },
];

export function ProcessSection() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">
            Proses Onboarding
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Dari formulir ke go-live
            <br className="hidden sm:block" />
            dalam 3 bulan.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Kami mengelola seluruh proses implementasi — kamu fokus pada pelayanan publik.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              {/* Big number watermark */}
              <span className="absolute -bottom-3 -right-1 font-heading text-7xl font-bold text-muted/20 select-none leading-none">
                {step.number}
              </span>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                    {step.duration}
                  </span>
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
