import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    id: "community",
    name: "Komunitas",
    target: "Kelurahan & RT/RW",
    price: "Gratis",
    priceSub: "Selamanya",
    highlight: false,
    badge: null,
    description:
      "Untuk komunitas lokal yang ingin mulai mengumpulkan dan melaporkan data kerusakan jalan di lingkungannya.",
    features: [
      "Akses pelaporan warga tak terbatas",
      "Peta kerusakan lingkup kelurahan",
      "Dashboard laporan sederhana",
      "Notifikasi status perbaikan",
      "Ekspor data CSV",
    ],
    cta: "Daftar Sekarang",
    href: "/register",
  },
  {
    id: "government",
    name: "Pemerintah Daerah",
    target: "Dinas PU & BPJN",
    price: "Hubungi Kami",
    priceSub: "Harga sesuai kebutuhan",
    highlight: true,
    badge: "Paling Populer",
    description:
      "Solusi lengkap untuk pemerintah kota/kabupaten mengelola, memprioritaskan, dan melacak perbaikan jalan.",
    features: [
      "Semua fitur Komunitas",
      "Dashboard analitik penuh",
      "Manajemen tim lapangan",
      "Prioritasi AI berdasarkan urgensi",
      "Integrasi dengan sistem e-PU",
      "SLA support 24/7",
      "Pelatihan & onboarding tim",
      "Akses API & ekspor data lanjutan",
    ],
    cta: "Ajukan Kemitraan",
    href: "#partnership-form",
  },
  {
    id: "enterprise",
    name: "Korporat & NGO",
    target: "Perusahaan & LSM",
    price: "Custom",
    priceSub: "Disesuaikan per proyek",
    highlight: false,
    badge: null,
    description:
      "Untuk perusahaan infrastruktur, kontraktor, dan organisasi nirlaba yang bergerak di bidang pembangunan jalan.",
    features: [
      "Semua fitur Pemerintah",
      "White-label platform",
      "Integrasi sistem internal",
      "Akses model AI untuk penelitian",
      "Dedicated account manager",
    ],
    cta: "Diskusi Kebutuhan",
    href: "#partnership-form",
  },
];

export function PartnershipTiers() {
  return (
    <section className="py-16 md:py-24 lg:py-32 px-5 md:px-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-7 md:mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-3">
            Paket Kemitraan
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Pilih model kemitraan <br className="hidden sm:block" />
            yang sesuai dengan kebutuhanmu
          </h2>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                "relative rounded-2xl border p-6 flex flex-col",
                tier.highlight
                  ? "border-primary bg-primary text-primary-foreground shadow-2xl shadow-primary/20 lg:-mt-4 lg:-mb-4 lg:py-10"
                  : "border-border bg-card",
              )}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-white text-primary font-semibold text-xs px-3 py-1 shadow-md">
                    {tier.badge}
                  </Badge>
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <div
                  className={cn(
                    "text-xs font-semibold uppercase tracking-[0.15em] mb-1",
                    tier.highlight
                      ? "text-primary-foreground/70"
                      : "text-primary",
                  )}
                >
                  {tier.target}
                </div>
                <h3
                  className={cn(
                    "font-heading text-2xl font-bold mb-1",
                    tier.highlight
                      ? "text-primary-foreground"
                      : "text-foreground",
                  )}
                >
                  {tier.name}
                </h3>
                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    tier.highlight
                      ? "text-primary-foreground/75"
                      : "text-muted-foreground",
                  )}
                >
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              <div
                className={cn(
                  "py-4 border-y mb-6",
                  tier.highlight
                    ? "border-primary-foreground/20"
                    : "border-border",
                )}
              >
                <div
                  className={cn(
                    "font-heading text-3xl font-bold",
                    tier.highlight
                      ? "text-primary-foreground"
                      : "text-foreground",
                  )}
                >
                  {tier.price}
                </div>
                <div
                  className={cn(
                    "text-xs mt-0.5",
                    tier.highlight
                      ? "text-primary-foreground/60"
                      : "text-muted-foreground",
                  )}
                >
                  {tier.priceSub}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-8">
                {tier.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                        tier.highlight
                          ? "bg-primary-foreground/20"
                          : "bg-primary/10",
                      )}
                    >
                      <Check
                        className={cn(
                          "w-2.5 h-2.5",
                          tier.highlight
                            ? "text-primary-foreground"
                            : "text-primary",
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-sm",
                        tier.highlight
                          ? "text-primary-foreground/85"
                          : "text-muted-foreground",
                      )}
                    >
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                size="lg"
                className={cn(
                  "w-full",
                  tier.highlight
                    ? "bg-white text-primary hover:bg-white/90"
                    : "",
                )}
                variant={tier.highlight ? "default" : "outline"}
                asChild
              >
                <Link href={tier.href}>{tier.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
