"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  BrainCircuit,
  User,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpvotes } from "@/hooks/useUpvotes";

// Definisi tipe data berdasarkan skema
interface ReportDetail {
  id: string;
  title: string;
  description: string;
  address: string;
  kota: string;
  provinsi: string;
  category: string;
  status: string;
  urgency: string;
  imageUrl: string;
  aiScore?: number;
  aiLevel?: string;
  aiSummary?: string;
  createdAt: string;
  author: { name: string };
  upvoteCount: number;
  upvotes?: { id: string }[];
}

const STATUS_COLOR: Record<string, string> = {
  fail: "bg-slate-100 text-slate-600",
  verified: "bg-blue-100 text-blue-700",
};

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const upvotes = useUpvotes();

  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/reports/${params.id}`);
        const json = await res.json();

        if (!res.ok) throw new Error(json.message || "Gagal memuat data");

        const detailData = json.data;
        setReport(detailData);

        // ⬅️ Sync data upvote dari server ke memori klien
        // Cek apakah user saat ini sudah upvote (berdasarkan relasi upvotes yang dikembalikan Prisma)
        const userHasVoted =
          detailData.upvotes && detailData.upvotes.length > 0;
        upvotes.sync(detailData.id, detailData.upvoteCount, userHasVoted);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleVote = () => {
    if (report) {
      upvotes.toggle(report.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p>Memuat detail laporan...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <h2 className="text-xl font-bold">Laporan Tidak Ditemukan</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button
          onClick={() => router.push("/dashboard/reports")}
          variant="outline"
        >
          Kembali
        </Button>
      </div>
    );
  }

  const currentUpvoteCount = upvotes.getCount(report.id);
  const hasVoted = upvotes.hasVoted(report.id);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-6">
        {/* Tombol Kembali */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        {/* Galeri Gambar (menampilkan gambar pertama jika array) */}
        <div className="relative w-full aspect-video md:h-100 bg-muted rounded-xl overflow-hidden border border-border shadow-sm">
          {report.imageUrl ? (
            <Image
              src={report.imageUrl}
              alt={report.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Tidak ada foto terlampir
            </div>
          )}

          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className="bg-background/90 backdrop-blur-md text-foreground hover:bg-background/90 px-3 py-1 text-sm shadow">
              {report.category.toUpperCase()}
            </Badge>
            <Badge
              className={cn(
                "px-3 py-1 text-sm font-semibold shadow hover:bg-opacity-90 border-none",
                STATUS_COLOR[report.status],
              )}
            >
              {report.status.toUpperCase().replace("_", " ")}
            </Badge>
          </div>
        </div>

        {/* Konten Utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Header Judul & Info Dasar */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                {report.title.toUpperCase()}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(report.createdAt), "dd MMMM yyyy, HH:mm", {
                    locale: idLocale,
                  })}
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  Dilaporkan oleh:{" "}
                  <span className="font-medium text-foreground">
                    {report.author?.name || "Warga"}
                  </span>
                </div>
              </div>
            </div>

            {/* Deskripsi Laporan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Deskripsi Kerusakan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {report.description}
                </p>
              </CardContent>
            </Card>

            {/* Lokasi Kerusakan */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Lokasi Kerusakan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80">{report.address}</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {report.kota}, {report.provinsi}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Analisis AI */}
          <div className="space-y-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2 text-primary">
                  <BrainCircuit className="w-5 h-5" />
                  Hasil Analisis AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {report.status === "fail" ? (
                  <div className="flex flex-col items-center py-4 text-center">
                    <AlertTriangle className="w-8 h-8 text-destructive mb-2" />
                    <p className="text-sm font-medium text-destructive">
                      Gagal Diverifikasi
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Sistem AI tidak dapat mengidentifikasi kerusakan pada
                      gambar ini, atau gambar tidak jelas.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Tampilkan UI Urgensi, AI Score, dan Summary seperti biasa */}
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Tingkat Urgensi
                      </p>
                      <Badge
                        variant={
                          report.urgency === "high" ? "destructive" : "default"
                        }
                      >
                        {report.urgency.toUpperCase()}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        AI Confidence Score
                      </p>
                      <div className="text-2xl font-bold text-foreground">
                        {report.aiScore ? `${report.aiScore}%` : "N/A"}
                      </div>
                    </div>

                    {report.aiSummary && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Ringkasan Sistem
                        </p>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                          {report.aiSummary}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>{" "}
            </Card>

            {/* Tombol Dukung Laporan */}
            <Button
              className={cn(
                "w-full gap-2 transition-all duration-200",
                hasVoted
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30 hover:bg-primary/90"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
              )}
              size="lg"
              onClick={handleVote}
            >
              <ThumbsUp className={cn("w-5 h-5", hasVoted && "fill-current")} />
              {hasVoted ? "Telah Didukung" : "Dukung Laporan"}
              <span
                className={cn(
                  "ml-1 px-2 py-0.5 rounded-full text-xs font-bold",
                  hasVoted
                    ? "bg-primary-foreground/20"
                    : "bg-muted-foreground/20",
                )}
              >
                {currentUpvoteCount}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
