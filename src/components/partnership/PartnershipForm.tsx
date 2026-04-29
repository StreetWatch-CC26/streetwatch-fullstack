"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Send, Mail, Phone } from "lucide-react";

const partnerTypes = [
  "Pemerintah Kota/Kabupaten",
  "Dinas PU / BPJN",
  "Kementerian",
  "BUMN / BUMD",
  "Perusahaan Swasta",
  "NGO / Organisasi Nirlaba",
  "Lainnya",
];

export function PartnershipForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Simulate API call — replace with actual endpoint
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <section id="partnership-form" className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[360px_1fr] gap-16 items-start">
          {/* Left info */}
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-4">
              Hubungi Kami
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight mb-5">
              Mulai percakapan tentang kemitraan.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              Tim kemitraan kami akan merespons dalam 2×24 jam. Tidak ada
              komitmen di tahap awal — mari diskusi dulu.
            </p>

            {/* Contact details */}
            <div className="space-y-4">
              <a
                href="mailto:partnership@streetwatch.id"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Mail className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                partnership@streetwatch.id
              </a>
              <a
                href="tel:+628001234567"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Phone className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                0800-1234-567 (Gratis)
              </a>
            </div>

            {/* Current partners logos placeholder */}
            <div className="mt-10 pt-8 border-t border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
                Mitra Aktif
              </p>
              <div className="flex flex-wrap gap-2">
                {["Pekanbaru", "Batam", "Medan", "Surabaya", "Makassar", "Banjarmasin"].map(
                  (city) => (
                    <span
                      key={city}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted/50 text-muted-foreground"
                    >
                      Kota {city}
                    </span>
                  )
                )}
                <span className="text-xs px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary">
                  +12 lainnya
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-border bg-card p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12 gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground">
                  Formulir terkirim!
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                  Terima kasih telah menghubungi kami. Tim kemitraan akan
                  merespons dalam 2×24 jam ke email yang kamu daftarkan.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input
                      id="name"
                      placeholder="Budi Santoso"
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="title">Jabatan *</Label>
                    <Input
                      id="title"
                      placeholder="Kepala Dinas PU"
                      required
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Resmi *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="budi@pemkot.go.id"
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">No. Telepon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="08xx-xxxx-xxxx"
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="institution">Nama Instansi *</Label>
                  <Input
                    id="institution"
                    placeholder="Dinas Pekerjaan Umum Kota Pekanbaru"
                    required
                    className="bg-background"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Tipe Mitra *</Label>
                    <Select required>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Pilih tipe..." />
                      </SelectTrigger>
                      <SelectContent>
                        {partnerTypes.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="region">Wilayah Cakupan *</Label>
                    <Input
                      id="region"
                      placeholder="Kota Pekanbaru, Riau"
                      required
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">Ceritakan kebutuhan Anda</Label>
                  <Textarea
                    id="message"
                    placeholder="Apa tantangan utama yang ingin Anda selesaikan dengan StreetWatch? Berapa banyak jalan yang perlu dipantau? Adakah sistem yang sudah berjalan?"
                    rows={4}
                    className="bg-background resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Kirim Formulir Kemitraan
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Dengan mengirim formulir ini, kamu menyetujui{" "}
                  <a href="/privacy" className="underline underline-offset-4 hover:text-foreground">
                    Kebijakan Privasi
                  </a>{" "}
                  StreetWatch.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
