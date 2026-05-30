import { Award } from "lucide-react";
import Image from "next/image";

const pressLogos = [
  {
    name: "Coding Camp Powered By DBS Foundation",
    src: "/images/sponsors/coding-camp-logo.svg",
  },
  { name: "Dicoding Indonesia", src: "/images/sponsors/dicoding-logo.svg" },
];

const awards = [
  {
    title: "Best Capstone 2026",
    event: "Coding Camp Powered By DBS Foundation",
    year: "2026",
  },
];

export function PressSection() {
  return (
    <section className="py-16 md:py-24 lg:py-32 px-5 md:px-20 border-t border-border bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Press logos */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em] mb-8">
            Disponsori oleh
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {pressLogos.map((logo) => (
              <div key={logo.name} className="h-auto w-auto transition">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={120}
                  height={60}
                  className="object-contain transition bg-white rounded-md p-1 md:p-3"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-border my-12" />

        {/* Awards */}
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-8 text-center">
            Penghargaan
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {awards.map((award) => (
              <div
                key={award.title}
                className="rounded-2xl border border-border bg-card p-5 flex items-start gap-4 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm leading-tight mb-1">
                    {award.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {award.event}
                  </div>
                  <div className="text-xs font-mono text-primary mt-1">
                    {award.year}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
