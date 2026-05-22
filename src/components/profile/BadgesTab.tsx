"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { BadgeData } from "@/types/profile";

export function BadgesTab() {
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await fetch("/api/user/badges");
        const json = await res.json();
        if (json.success) setBadges(json.data);
      } catch (err) {
        console.error("Gagal mengambil badges", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={cn(
              "rounded-2xl border p-4 text-center transition-all",
              badge.earned
                ? "border-primary/30 bg-primary/5 hover:border-primary/50"
                : "border-border bg-muted/30 opacity-50 grayscale",
            )}
          >
            <div className="text-3xl mb-2">{badge.icon}</div>
            <div
              className={cn(
                "font-heading font-bold text-sm",
                badge.earned ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {badge.name}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">
              {badge.description}
            </div>
            {badge.earned && (
              <Badge className="mt-2 text-[9px] bg-primary/10 text-primary border-0 px-2">
                Diraih ✓
              </Badge>
            )}
          </div>
        ))}
      </div>

      {/* Points guide */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="font-heading font-bold text-foreground text-sm mb-3">
          Cara Dapat Poin
        </h3>
        <div className="space-y-2">
          {[
            { action: "Membuat laporan baru", pts: "+50 poin" },
            { action: "Laporan terverifikasi", pts: "+50 poin" },
            { action: "Laporan mendapat 20 upvote", pts: "+100 poin" },
          ].map((item) => (
            <div
              key={item.action}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-muted-foreground">{item.action}</span>
              <span className="font-semibold text-primary">{item.pts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
