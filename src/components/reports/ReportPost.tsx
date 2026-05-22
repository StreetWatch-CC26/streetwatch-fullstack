// src/components/reports/ReportPost.tsx
"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Image as ImageIcon,
  User,
  AlertCircle,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_COLOR } from "@/lib/constants";
import { useUpvotes } from "@/hooks/useUpvotes";
import type { ReportItem } from "@/types/report";

interface ReportPostProps {
  report: ReportItem;
}

export function ReportPost({ report }: ReportPostProps) {
  const router = useRouter();
  const upvotes = useUpvotes();

  const timeAgo = formatDistanceToNow(new Date(report.createdAt), {
    addSuffix: true,
    locale: idLocale,
  });

  useEffect(() => {
    const userHasVoted = report.upvotes && report.upvotes.length > 0;
    upvotes.sync(report.id, report.upvoteCount, !!userHasVoted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report.id]);

  const currentUpvoteCount = upvotes.getCount(report.id);
  const hasVoted = upvotes.hasVoted(report.id);

  return (
    // Penyesuaian: border-b untuk mobile (krn gap-0), border utuh di layar besar, h-full agar rapi di grid
    <article className="bg-card border-b sm:border border-border sm:rounded-xl overflow-hidden flex flex-col shadow-sm h-full">
      {/* ── Header Post ── */}
      <div className="flex items-center justify-between p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border border-border shrink-0 overflow-hidden">
            {report.author?.image ? (
              <Image
                src={report.author.image}
                alt="Avatar"
                className="w-full h-full object-cover"
                width={32}
                height={32}
              />
            ) : (
              <User className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground leading-tight line-clamp-1">
              {report.author?.name || "Warga Anonim"}
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5">
              {timeAgo}
            </span>
          </div>
        </div>
        <Badge
          variant="secondary"
          className={cn(
            "text-[10px] px-2 py-0.5 border-none shrink-0 ml-2",
            STATUS_COLOR[report.status] || "bg-muted text-muted-foreground",
          )}
        >
          {report.status.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      {/* ── Gambar Post ── */}
      <div
        className="relative w-full aspect-square bg-muted cursor-pointer"
        onClick={() => router.push(`/dashboard/reports/${report.id}`)}
      >
        {report.imageUrl ? (
          <Image
            src={report.imageUrl}
            alt={report.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-2">
            <ImageIcon className="w-12 h-12" />
            <span className="text-sm font-medium">
              Tidak ada foto terlampir
            </span>
          </div>
        )}

        {report.urgency === "high" && (
          <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground p-1.5 rounded-full shadow-lg animate-pulse">
            <AlertCircle className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* ── Footer / Actions & Content ── */}
      <div className="p-3 sm:p-4 flex flex-col grow space-y-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => upvotes.toggle(report.id)}
            className={cn(
              "flex items-center gap-1.5 group transition-colors",
              hasVoted ? "text-primary" : "text-foreground hover:text-primary",
            )}
          >
            <ThumbsUp
              className={cn(
                "w-6 h-6 transition-all",
                hasVoted && "fill-current",
              )}
            />
            <span className="text-sm font-bold">{currentUpvoteCount}</span>
          </button>
        </div>

        <div className="grow">
          <p className="text-sm text-foreground">
            <span className="font-semibold mr-2">{report.title}</span>
            <span className="text-muted-foreground line-clamp-2 mt-1">
              {report.description || "Tidak ada deskripsi yang diberikan."}
            </span>
          </p>
          <button
            onClick={() => router.push(`/dashboard/reports/${report.id}`)}
            className="text-xs text-muted-foreground mt-1 hover:text-primary transition-colors"
          >
            Lihat detail selengkapnya...
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 mt-auto">
          <div className="flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/10 px-2 py-1 rounded-md max-w-[70%]">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="line-clamp-1">{report.kota}</span>
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest shrink-0">
            #{report.category}
          </span>
        </div>
      </div>
    </article>
  );
}
