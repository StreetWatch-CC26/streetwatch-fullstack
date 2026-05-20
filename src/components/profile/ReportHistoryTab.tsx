"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  STATUS_COLOR,
  STATUS_LABEL,
  URGENCY_COLOR,
  URGENCY_LABEL,
} from "@/lib/constants";
import type { ReportItem } from "@/types/profile";

export function ReportHistoryTab() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/user/reports");
        const json = await res.json();
        if (json.success) setReports(json.data);
      } catch (err) {
        console.error("Gagal mengambil riwayat laporan", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
        <MapPin className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Belum ada laporan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((r) => (
        <div
          key={r.id}
          className="rounded-2xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono text-muted-foreground mb-0.5">
                {r.id}
              </p>
              <p className="text-sm font-semibold text-foreground line-clamp-1">
                {r.title}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{r.address}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <Badge className={cn("text-[10px]", URGENCY_COLOR[r.urgency])}>
                {URGENCY_LABEL[r.urgency]}
              </Badge>
              <Badge className={cn("text-[10px]", STATUS_COLOR[r.status])}>
                {STATUS_LABEL[r.status]}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" /> {r.upvoteCount} dukungan
            </span>
            <span>
              {format(new Date(r.createdAt), "d MMM yyyy", { locale: id })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
