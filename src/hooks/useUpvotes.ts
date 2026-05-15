"use client";

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";

export function useUpvotes() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [voted, setVoted] = useState<Set<string>>(new Set());

  const pendingReqs = useRef<Set<string>>(new Set());

  const sync = useCallback((id: string, count: number, hasVoted: boolean) => {
    setCounts((prev) => ({ ...prev, [id]: count }));
    setVoted((prev) => {
      const next = new Set(prev);
      if (hasVoted) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const toggle = useCallback(async (reportId: string) => {
    // 1. BLOKIR JIKA SEDANG PROSES (Anti Spam)
    if (pendingReqs.current.has(reportId)) return;

    // Kunci laporan ini
    pendingReqs.current.add(reportId);

    let previousCount = 0;
    let wasVoted = false;

    // 2. Optimistic Update
    setVoted((prev) => {
      const next = new Set(prev);
      wasVoted = next.has(reportId);

      // PERBAIKAN LINTER: Gunakan if-else
      if (wasVoted) {
        next.delete(reportId);
      } else {
        next.add(reportId);
      }

      return next;
    });

    setCounts((prev) => {
      previousCount = prev[reportId] ?? 0;
      const delta = wasVoted ? -1 : 1;
      return { ...prev, [reportId]: previousCount + delta };
    });

    // 3. API Call ke Backend
    try {
      const res = await fetch(`/api/reports/${reportId}/upvote`, {
        method: "POST",
      });
      let json;
      const textResponse = await res.text();
      try {
        json = JSON.parse(textResponse);
      } catch {
        throw new Error(`Server Error (${res.status}): Endpoint tidak valid`);
      }

      if (!res.ok) throw new Error(json.message || "Gagal memproses dukungan");

      // 4. Sync ulang dengan data valid dari server
      setCounts((prev) => ({ ...prev, [reportId]: json.data.upvoteCount }));
      setVoted((prev) => {
        const next = new Set(prev);
        if (json.data.upvoted) {
          next.add(reportId);
        } else {
          next.delete(reportId);
        }
        return next;
      });
    } catch (err) {
      // 5. Rollback jika gagal
      setVoted((prev) => {
        const next = new Set(prev);
        if (wasVoted) {
          next.add(reportId);
        } else {
          next.delete(reportId);
        }
        return next;
      });
      setCounts((prev) => ({ ...prev, [reportId]: previousCount }));

      console.error("[Upvote Error]:", err);
      toast.error("Gagal memproses dukungan. Pastikan kamu sudah login.");
    } finally {
      // 6. BUKA KUNCI
      pendingReqs.current.delete(reportId);
    }
  }, []);

  const hasVoted = useCallback((id: string) => voted.has(id), [voted]);
  const getCount = useCallback((id: string) => counts[id] ?? 0, [counts]);

  return { toggle, hasVoted, getCount, sync };
}
