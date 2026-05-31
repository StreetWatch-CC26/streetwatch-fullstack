// src/app/dashboard/reports/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { cleanExcessWhitespace, cn } from "@/lib/utils";

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
  CheckCircle2,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

import { AIAnalysisCard } from "@/components/reports/AIAnalysisCard";
import { useUpvotes } from "@/hooks/useUpvotes";
import { STATUS_COLOR, URGENCY_COLOR, URGENCY_LABEL } from "@/lib/constants";
import type { ReportDetail } from "@/types/report";

interface ApiResponse {
  message?: string;
  data: ReportDetail;
}

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const upvotes = useUpvotes();

  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Show success toast when redirected from AddReport
  useEffect(() => {
    if (searchParams.get("submitted") === "true") {
      toast.success("Laporan berhasil dikirim! Terima kasih.", {
        duration: 5000,
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (!params.id) return;

    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/reports/${params.id}`);
        const json = (await res.json()) as ApiResponse;

        if (!res.ok) throw new Error(json.message || "Gagal memuat data");

        setReport(json.data);
        upvotes.sync(
          json.data.id,
          json.data.upvoteCount,
          !!(json.data.upvotes && json.data.upvotes.length > 0),
        );
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Terjadi kesalahan sistem",
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Memuat detail laporan...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-xl font-bold">Laporan Tidak Ditemukan</h2>
        <p className="text-muted-foreground text-sm max-w-xs">{error}</p>
        <Button
          onClick={() => router.push("/dashboard/reports")}
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Feeds
        </Button>
      </div>
    );
  }

  const currentUpvoteCount = upvotes.getCount(report.id);
  const hasVoted = upvotes.hasVoted(report.id);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: report.title, url }).catch(() => null);
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link disalin ke clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-28 sm:pb-24">
      {/* ── Photo banner — natural ratio, capped at 60vh ── */}
      <div className="w-full bg-muted border-b border-border relative overflow-hidden">
        {report.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={report.imageUrl}
            alt={report.title}
            className="w-full max-h-[60vh] object-contain"
          />
        ) : (
          <div className="w-full h-52 flex flex-col items-center justify-center text-muted-foreground/30 gap-2">
            <User className="w-10 h-10" />
            <span className="text-sm">Tidak ada foto terlampir</span>
          </div>
        )}

        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <Badge
            className={cn(
              "text-[10px] px-2.5 py-1 border shadow-sm backdrop-blur-sm",
              STATUS_COLOR[report.status],
            )}
          >
            {report.status.replace("_", " ").toUpperCase()}
          </Badge>
          <Badge
            className={cn(
              "text-[10px] px-2.5 py-1 border shadow-sm backdrop-blur-sm bg-background/80",
              URGENCY_COLOR[report.urgency],
            )}
          >
            Keparahan {URGENCY_LABEL[report.urgency] ?? report.urgency}
          </Badge>
        </div>

        {/* Category chip */}
        <div className="absolute top-3 right-3">
          <Badge className="text-[10px] px-2.5 py-1 bg-background/80 backdrop-blur-sm border border-border text-foreground shadow-sm">
            #{report.category}
          </Badge>
        </div>
      </div>

      {/* ── Mobile fixed action bar ── */}
      <div className="sm:hidden bg-background/95 backdrop-blur-md border-t border-border px-4 py-3 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard/reports")}
          className="h-11 px-3"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>

        <Button
          size="sm"
          onClick={() => upvotes.toggle(report.id)}
          className={cn(
            "flex-1 h-11 gap-2 text-sm font-semibold transition-all",
            hasVoted
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground border border-border",
          )}
        >
          <ThumbsUp className={cn("w-4 h-4", hasVoted && "fill-current")} />
          {hasVoted ? "Didukung" : "Dukung"}
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-bold tabular-nums",
              hasVoted ? "bg-primary-foreground/20" : "bg-foreground/10",
            )}
          >
            {currentUpvoteCount}
          </span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="h-11 px-3"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 mt-5 sm:mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3">
                {report.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                  {format(new Date(report.createdAt), "dd MMMM yyyy, HH:mm", {
                    locale: idLocale,
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="font-semibold text-foreground">
                    {report.author?.name || "Warga Anonim"}
                  </span>
                </span>
              </div>
            </div>

            {/* Description */}
            <Card className="shadow-sm">
              <CardContent className="pt-4 pb-4">
                <p className="text-sm sm:text-base text-foreground/80 leading-relaxed text-justify whitespace-pre-wrap">
                  {cleanExcessWhitespace(report.description) ||
                    "Tidak ada deskripsi yang diberikan."}
                </p>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b border-border/50 pt-4 px-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Detail Lokasi
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 pb-4 px-4">
                <p className="text-sm font-medium text-foreground">
                  {report.address}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {[report.kecamatan, report.kota, report.provinsi]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">
            <AIAnalysisCard report={report} />

            {/* Action buttons — sticky on desktop, fixed bottom bar on mobile */}
            <>
              {/* Desktop sticky */}
              <div className="hidden sm:flex flex-col gap-3 sticky top-6">
                <Button
                  size="lg"
                  onClick={() => upvotes.toggle(report.id)}
                  className={cn(
                    "w-full gap-2 h-12 text-sm font-semibold transition-all duration-300",
                    hasVoted
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
                  )}
                >
                  <ThumbsUp
                    className={cn("w-4 h-4", hasVoted && "fill-current")}
                  />
                  {hasVoted ? "Telah Didukung" : "Dukung Laporan"}
                  <span
                    className={cn(
                      "ml-auto px-2.5 py-0.5 rounded-full text-xs font-bold tabular-nums",
                      hasVoted
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-foreground/10 text-foreground",
                    )}
                  >
                    {currentUpvoteCount}
                  </span>
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="flex-1 gap-2 h-10 text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    Bagikan
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard/reports")}
                    className="flex-1 gap-2 h-10 text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                  </Button>
                </div>

                {hasVoted && (
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary/8 border border-primary/20 text-xs text-primary font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Terima kasih atas dukungan Anda!
                  </div>
                )}
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
}
