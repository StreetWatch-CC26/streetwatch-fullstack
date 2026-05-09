"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Calendar, Image as ImageIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cn } from "@/lib/utils";

// ─── Definisi Tipe Data ────────────────────────────────────────────────────────
interface ReportItem {
  id: string;
  title: string;
  description: string;
  address: string;
  kota: string;
  provinsi: string;
  category: string;
  status: string;
  urgency: string;
  imageUrl: string | null;
  createdAt: string;
  upvoteCount: number;
}

const STATUS_COLOR: Record<string, string> = {
  fail: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  verified: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

export default function ReportsPage() {
  const router = useRouter();

  // ─── State Management ────────────────────────────────────────────────────────
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ─── Fetch Data dari API ─────────────────────────────────────────────────────
  useEffect(() => {
    async function fetchReports() {
      try {
        // Ambil 50 data terbaru (bisa disesuaikan atau ditambah fitur pagination nantinya)
        const res = await fetch("/api/reports?limit=50&sort=createdAt_desc");
        const json = await res.json();

        if (json.success) {
          setReports(json.data);
        }
      } catch (error) {
        console.error("Gagal memuat daftar laporan:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Daftar Laporan
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Jelajahi laporan kerusakan infrastruktur yang masuk
            </p>
          </div>
        </div>

        {/* State Loading */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Memuat laporan...</p>
          </div>
        ) : reports.length === 0 ? (
          /* State Kosong */
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/20 border border-dashed border-border rounded-xl">
            <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm font-medium">Belum ada laporan</p>
          </div>
        ) : (
          /* Grid Laporan */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card
                key={report.id}
                onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                className="overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer group flex flex-col rounded-lg"
              >
                {/* Gambar Laporan */}
                <div className="relative w-full h-48 bg-muted overflow-hidden border-b border-border px-3">
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
                      <span className="text-xs font-medium">
                        Tidak ada foto
                      </span>
                    </div>
                  )}

                  {/* Badge Category di Atas Gambar */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-background/90 backdrop-blur-md text-foreground text-[10px] border-none shadow-sm">
                      {report.category.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="px-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                      {report.id}
                      {/* {report.id.substring(0, 8)}... */}
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-[10px] px-2 py-0 font-medium border-none",
                        STATUS_COLOR[report.status] ||
                          "bg-muted text-muted-foreground",
                      )}
                    >
                      {report.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                    {report.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-4 pt-0 flex-1">
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                    {report.description}
                  </p>

                  <div className="flex items-start gap-2 text-xs text-foreground/80">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="line-clamp-1">
                      {report.address}, {report.kota}, {report.provinsi}
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-3 border-t border-border/50 flex justify-between bg-muted/20">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(report.createdAt), "dd MMM yyyy", {
                      locale: idLocale,
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
        )}
      </div>
    </div>
  );
}
