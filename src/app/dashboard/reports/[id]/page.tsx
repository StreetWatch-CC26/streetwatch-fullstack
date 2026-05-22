// src/app/dashboard/reports/[id]/page.tsx
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
  User,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { AIAnalysisCard } from "@/components/reports/AIAnalysisCard";
import { useUpvotes } from "@/hooks/useUpvotes";
import { STATUS_COLOR } from "@/lib/constants";
import type { ReportDetail } from "@/types/report";

interface ApiResponse {
  message?: string;
  data: ReportDetail;
}

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
        const json = (await res.json()) as ApiResponse;

        if (!res.ok) throw new Error(json.message || "Gagal memuat data");

        const detailData = json.data;
        setReport(detailData);

        const userHasVoted =
          detailData.upvotes && detailData.upvotes.length > 0;
        upvotes.sync(detailData.id, detailData.upvoteCount, !!userHasVoted);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Terjadi kesalahan sistem",
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">
            Menganalisis dan memuat laporan...
          </p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 px-4 text-center">
        <AlertTriangle className="w-12 h-12 text-destructive" />
        <h2 className="text-xl font-bold">Laporan Tidak Ditemukan</h2>
        <p className="text-muted-foreground text-sm">{error}</p>
        <Button
          onClick={() => router.push("/dashboard/reports")}
          variant="outline"
          className="mt-2"
        >
          Kembali ke Feed
        </Button>
      </div>
    );
  }

  const currentUpvoteCount = upvotes.getCount(report.id);
  const hasVoted = upvotes.hasVoted(report.id);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* ── Banner Gambar Laporan ── */}
      <div className="w-full h-64 md:h-100 relative bg-muted border-b border-border">
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
          <Badge className="bg-background/90 backdrop-blur-md text-foreground border-none px-3 py-1 text-xs shadow">
            {report.category.toUpperCase()}
          </Badge>
          <Badge
            className={cn(
              "px-3 py-1 text-xs font-semibold shadow border-none",
              STATUS_COLOR[report.status],
            )}
          >
            {report.status.toUpperCase().replace("_", " ")}
          </Badge>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Konten Utama (Kiri Desktop / Atas Mobile) ── */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 leading-tight">
                {report.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  {format(new Date(report.createdAt), "dd MMMM yyyy, HH:mm", {
                    locale: idLocale,
                  })}
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-primary" />
                  Oleh:{" "}
                  <span className="font-semibold text-foreground">
                    {report.author?.name || "Warga"}
                  </span>
                </div>
              </div>
            </div>

            <Card className="shadow-sm">
              <CardContent>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                  {report.description || "Tidak ada deskripsi yang diberikan."}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-0 border-b border-border/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> Detail Lokasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 font-medium">
                  {report.address}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {report.kecamatan && `${report.kecamatan}, `} {report.kota},{" "}
                  {report.provinsi}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* ── Sidebar AI & Actions (Kanan Desktop / Bawah Mobile) ── */}
          <div className="space-y-6">
            <AIAnalysisCard report={report} />

            <div className="space-y-3 sticky top-6">
              <Button
                size="lg"
                onClick={() => upvotes.toggle(report.id)}
                className={cn(
                  "w-full gap-2 transition-all duration-300 h-14 text-base",
                  hasVoted
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
                )}
              >
                <ThumbsUp
                  className={cn("w-5 h-5", hasVoted && "fill-current")}
                />
                {hasVoted ? "Telah Didukung" : "Dukung Laporan Ini"}
                <span
                  className={cn(
                    "ml-auto px-3 py-1 rounded-full text-xs font-bold",
                    hasVoted
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-foreground/10 text-foreground",
                  )}
                >
                  {currentUpvoteCount} Dukungan
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/reports")}
                className="w-full gap-2 h-12"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Feed
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
