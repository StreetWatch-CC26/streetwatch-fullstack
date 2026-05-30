import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const stats = [
  { value: "1000+", label: "Laporan Terverifikasi" },
  { value: "18 Kota", label: "Wilayah Terjangkau" },
  { value: "92%", label: "Akurasi Deteksi AI" },
];

export function HeroSection({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-8 lg:pt-16 pb-16 md:pb-24 lg:pb-32 px-5 md:px-20">
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
            AI-Powered Pothole Monitoring System
          </Badge>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-6">
          Laporkan Jalan Rusak.
          <br />
          <span className="text-primary">Diperbaiki Lebih Cepat.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          StreetWatch menggunakan kecerdasan buatan untuk mendeteksi, memetakan,
          dan melacak kerusakan jalan dengan menghubungkan warga dengan
          pemerintah untuk respons yang lebih cepat.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 md:mb-16">
          <Button size="lg" className="gap-2 text-sm md:text-base px-8" asChild>
            {isLoggedIn ? (
              <Link href="/dashboard/reports">
                Lihat Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link href="/register">
                Laporkan Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 text-sm md:text-base px-8"
            asChild
          >
            <Link href="#how-it-works">Lihat Demo</Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading text-xl sm:text-3xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
