"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image"; // Import Next Image
import { MOCK_REPORTS } from "@/data/mock-reports";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  MapPin,
  Calendar,
  ArrowLeft,
  Plus,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const isSuccess = searchParams.get("success") === "true";

  const STATUS_COLOR: Record<string, string> = {
    pending:
      "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    verified:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    in_progress:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    resolved:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Area */}
      <div className="bg-card border-b border-border px-4 py-8 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Daftar Laporan
            </h1>
            <p className="text-muted-foreground mt-1">
              Pantau dan dukung perbaikan infrastruktur di sekitar Anda.
            </p>
          </div>
          <Link href="/reports/add">
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" />
              Buat Laporan Baru
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-6">
        {/* Notifikasi Sukses */}
        {isSuccess && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-500 bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-primary text-sm">
                Laporan Berhasil Terkirim!
              </h3>
              <p className="text-xs text-primary/80 mt-1">
                Terima kasih atas kontribusi Anda. Laporan sedang dalam tahap
                verifikasi.
              </p>
            </div>
          </div>
        )}

        {/* Grid Laporan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_REPORTS.map((report) => (
            <Card
              key={report.id}
              className="overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer group flex flex-col"
            >
              {/* Gambar Laporan */}
              <div className="relative w-full h-48 bg-muted overflow-hidden border-b border-border">
                {report.imageUrl ? (
                  <Image
                    src={report.imageUrl}
                    alt={report.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-2">
                    <ImageIcon className="w-10 h-10" />
                    <span className="text-xs font-medium">Tidak ada foto</span>
                  </div>
                )}

                {/* Badge Urgency di Atas Gambar */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-background/90 backdrop-blur-md text-foreground text-[10px] border-none shadow-sm">
                    {report.category}
                  </Badge>
                </div>
              </div>

              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                    {report.id}
                  </span>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-[10px] px-2 py-0 font-medium border-none",
                      STATUS_COLOR[report.status],
                    )}
                  >
                    {report.status.replace("_", " ")}
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                  {report.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 pt-0 flex-1">
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                  {report.description}
                </p>

                <div className="flex items-start gap-2 text-xs text-foreground/80">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span className="line-clamp-1">
                    {report.address}, {report.kota}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-3 border-t border-border/50 flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(report.createdAt), "dd MMM yyyy", {
                    locale: id,
                  })}
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  {report.urgency.toUpperCase()}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Mobile Back Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden z-50">
        <Link href="/dashboard">
          <Button
            variant="secondary"
            className="rounded-full shadow-xl border border-border gap-2 px-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
