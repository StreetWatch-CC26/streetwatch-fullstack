import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Scan, TrendingUp, ShieldCheck } from "lucide-react";

const stats = [
  { value: "2.400+", label: "Laporan Terproses" },
  { value: "18 Kota", label: "Wilayah Terjangkau" },
  { value: "94%", label: "Akurasi Deteksi AI" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 pb-6 ">
      {/* Background grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--foreground) 1px, transparent 3px),
            linear-gradient(to bottom, var(--foreground) 1px, transparent 3px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-150 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="flex justify-center mb-6 animate-fade-in">
          <Badge
            variant="outline"
            className="gap-2 px-4 py-1.5 text-xs font-medium border-primary/40 text-primary bg-primary/5"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            AI-Powered Pothole Monitoring
          </Badge>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
          Laporkan Jalan Rusak.
          <br />
          <span className="text-primary">Diperbaiki Lebih Cepat.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          StreetWatch menggunakan kecerdasan buatan untuk mendeteksi, memetakan,
          dan melacak kerusakan jalan dengan menghubungkan warga dengan
          pemerintah untuk respons yang lebih cepat.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="gap-2 text-base px-8" asChild>
            <Link href="/register">
              Laporkan Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 text-base px-8"
            asChild
          >
            <Link href="#how-it-works">Lihat Demo</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Dashboard Preview */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 mt-16">
        <div className="relative rounded-2xl border border-border bg-card/60 backdrop-blur-sm shadow-2xl overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <div className="w-3 h-3 rounded-full bg-green-400/70" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-background rounded-md px-3 py-1 text-xs text-muted-foreground border border-border max-w-xs mx-auto text-center">
                streetwatch.vercel.app/dashboard
              </div>
            </div>
          </div>
          {/* Mock dashboard content */}
          <div className="p-6 grid grid-cols-3 gap-4 min-h-70">
            {/* Map placeholder */}
            <div className="col-span-2 rounded-xl bg-muted/50 border border-border relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, var(--primary) 1px, transparent 1px),
                    linear-gradient(to bottom, var(--primary) 1px, transparent 1px)
                  `,
                  backgroundSize: "32px 32px",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Scan className="w-8 h-8 text-primary mx-auto mb-2 opacity-60" />
                  <p className="text-xs text-muted-foreground font-medium">
                    Peta Kerusakan Real-time
                  </p>
                </div>
              </div>
              {/* Dots */}
              {[
                { top: "30%", left: "25%" },
                { top: "55%", left: "60%" },
                { top: "70%", left: "35%" },
                { top: "40%", left: "70%" },
              ].map((pos, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/40"
                  style={{ top: pos.top, left: pos.left }}
                >
                  <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-50" />
                </div>
              ))}
            </div>

            {/* Side stats */}
            <div className="flex flex-col gap-3">
              {[
                {
                  icon: TrendingUp,
                  label: "Laporan Baru",
                  value: "12 hari ini",
                  color: "text-primary",
                },
                {
                  icon: ShieldCheck,
                  label: "Ditangani",
                  value: "89 bulan ini",
                  color: "text-green-500",
                },
                {
                  icon: Scan,
                  label: "Dideteksi AI",
                  value: "94% akurat",
                  color: "text-blue-500",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border bg-background p-3 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
