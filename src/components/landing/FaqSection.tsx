"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Siapa yang bisa menggunakan StreetWatch?",
    a: "Semua warga Indonesia dapat menggunakan StreetWatch secara gratis untuk melaporkan kerusakan jalan. Pemerintah daerah dan dinas PU mendapat akses dashboard khusus untuk manajemen laporan.",
  },
  {
    q: "Bagaimana AI mendeteksi kerusakan jalan?",
    a: "Model computer vision kami dilatih dengan lebih dari 500.000 gambar kerusakan jalan dari berbagai kondisi. AI mengidentifikasi jenis kerusakan (lubang, retak, ambles) sekaligus mengestimasi tingkat keparahan dari Low hingga Critical.",
  },
  {
    q: "Apakah laporan saya akan ditindaklanjuti?",
    a: "Laporan yang terverifikasi langsung masuk ke dashboard dinas terkait. Kami memiliki MoU dengan 18 pemerintah kota/kabupaten. Anda akan mendapat notifikasi di setiap tahap proses penanganan.",
  },
  {
    q: "Apakah data lokasi saya aman?",
    a: "Ya. Data GPS hanya digunakan untuk menentukan lokasi kerusakan dan tidak pernah dijual ke pihak ketiga. Anda juga bisa melaporkan secara anonim jika diperlukan.",
  },
  {
    q: "Bagaimana cara pemerintah mengakses platform ini?",
    a: "Dinas PU dan pemerintah daerah dapat mengajukan akses melalui form Partnership di website kami. Tim kami akan menghubungi dalam 2×24 jam untuk proses onboarding.",
  },
  {
    q: "Apakah tersedia versi mobile?",
    a: "StreetWatch tersedia sebagai Progressive Web App (PWA) yang dapat diinstall di Android dan iOS langsung dari browser, tanpa perlu download dari app store.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            FAQ
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            Pertanyaan yang sering ditanyakan
          </h2>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border border-border rounded-xl px-5 bg-card data-[state=open]:border-primary/40 transition-colors"
            >
              <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
