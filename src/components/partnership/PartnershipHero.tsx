import { Building2, Users, TrendingUp } from "lucide-react";

const quickStats = [
  { icon: Building2, value: "18", label: "Pemerintah" },
  { icon: Users, value: "50K+", label: "Pengguna Aktif" },
  { icon: TrendingUp, value: "75%", label: "Tingkat Respons" },
];

export function PartnershipHero() {
  return (
    <section className="relative pt-8 lg:pt-20 pb-16 md:pb-24 lg:pb-32 px-5 md:px-20 overflow-hidden">
      {/* Background mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.511_0.096_186.391/0.12),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--foreground) 1px, transparent 1px),
              linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-5 md:mb-8">
          <div className="h-px w-12 bg-primary" />
          <span className="text-xs font-semibold text-primary uppercase tracking-[0.2em]">
            Kemitraan
          </span>
        </div>

        {/* Split headline */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-5 md:gap-10 items-end mb-10 md:mb-16">
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.02]">
            Bersama kita
            <br />
            wujudkan kota
            <br />
            <em className="text-primary not-italic">yang lebih baik.</em>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed lg:pb-1">
            StreetWatch bermitra dengan pemerintah daerah, instansi pusat, dan
            organisasi masyarakat sipil untuk menciptakan infrastruktur jalan
            yang terkelola secara data-driven dan akuntabel.
          </p>
        </div>

        {/* Quick stats bar */}
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {quickStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-3 md:p-5 flex items-center gap-2 md:gap-4"
            >
              <div className="w-5 md:w-10 h-5 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <stat.icon className="w-3 md:w-5 h-3 md:h-5 text-primary" />
              </div>
              <div>
                <div className="font-heading text-xl md:text-2xl font-bold text-foreground leading-none">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
