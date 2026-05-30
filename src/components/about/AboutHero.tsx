import Image from "next/image";

export function AboutHero() {
  return (
    <section className="relative pt-8 lg:pt-20 pb-16 md:pb-24 lg:pb-32 px-5 md:px-20 overflow-hidden">
      {/* Diagonal background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-150 h-150 rounded-full bg-primary/8 blur-[100px]" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full h-px bg-linear-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-5 md:mb-8">
          <div className="h-px w-12 bg-primary" />
          <span className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">
            Tentang Kami
          </span>
        </div>

        {/* Headline — editorial asymmetric layout */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-6 md:gap-12 items-end">
          <div>
            <h1 className="font-heading text-4xl sm:text-6xl font-bold text-foreground leading-[1.02] tracking-tight mb-0">
              Kami percaya
              <br />
              infrastruktur yang
              <br />
              <em className="text-primary not-italic">baik adalah hak</em>
              <br />
              semua orang.
            </h1>
          </div>

          <div className="lg:pb-2">
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3 md:mb-6">
              StreetWatch lahir dari frustrasi kolektif terhadap jalan rusak
              yang dilaporkan bertahun-tahun tanpa penanganan. Kami membangun
              teknologi untuk mengubah itu.
            </p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-10 h-10 p-1 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Image
                  src="/images/png_favicon_light.png"
                  alt="StreetWatch Logo"
                  width={40}
                  height={40}
                  className="hidden dark:block"
                />
                <Image
                  src="/images/png_favicon_dark.png"
                  alt="StreetWatch Logo"
                  width={40}
                  height={40}
                  className="block dark:hidden"
                />
              </div>
              <div>
                <div className="font-medium text-foreground">
                  Tim StreetWatch
                </div>
                <div className="text-xs">Didirikan 2026 · Indonesia</div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider with year */}
        <div className="flex items-center gap-6 mt-16">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground font-mono tracking-widest">
            EST. 2026
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
      </div>
    </section>
  );
}
