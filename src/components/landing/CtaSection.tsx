import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2 } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 lg:py-32 px-5 md:px-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-primary px-8 py-16 lg:px-16 lg:py-20 text-center">
          {/* Background decoration */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, white 1px, transparent 1px),
                linear-gradient(to bottom, white 1px, transparent 1px)
              `,
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-2xl" />

          <div className="relative z-10">
            <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 tracking-tight">
              Bergabung sekarang.
              <br />
              Jadikan jalananmu lebih aman.
            </h2>
            <p className="text-primary-foreground/80 text-sm md:text-lg max-w-xl mx-auto mb-5 md:mb-10">
              Mulai laporkan kerusakan jalan di sekitarmu secara gratis, atau
              daftarkan instansi pemerintahmu untuk akses penuh.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gap-2 bg-white text-primary hover:bg-white/90 text-sm md:text-base px-8"
                asChild
              >
                <Link href="/register">
                  Mulai Gratis
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                className="gap-2 bg-white text-primary hover:bg-white/90 text-sm md:text-base px-8"
                asChild
              >
                <Link href="/partnership">
                  <Building2 className="w-4 h-4" />
                  Untuk Pemerintah
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
