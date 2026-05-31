"use client";

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";

interface UpvoteState {
  count: number;
  hasVoted: boolean;
}

export function useUpvotes(initialState: Record<string, UpvoteState> = {}) {
  const [upvoteData, setUpvoteData] =
    useState<Record<string, UpvoteState>>(initialState);
  const pendingReqs = useRef<Set<string>>(new Set());

  const sync = useCallback((id: string, count: number, hasVoted: boolean) => {
    setUpvoteData((prev) => ({
      ...prev,
      [id]: { count, hasVoted },
    }));
  }, []);

  const toggle = useCallback(async (reportId: string) => {
    if (pendingReqs.current.has(reportId)) return;
    pendingReqs.current.add(reportId);

    let previousState: UpvoteState | undefined;

    setUpvoteData((prev) => {
      previousState = prev[reportId];
      const currentCount = previousState?.count ?? 0;
      const currentVoted = previousState?.hasVoted ?? false;

      return {
        ...prev,
        [reportId]: {
          hasVoted: !currentVoted,
          count: currentVoted ? currentCount - 1 : currentCount + 1,
        },
      };
    });

    try {
      const res = await fetch(`/api/reports/${reportId}/upvote`, {
        method: "POST",
      });
      const textResponse = await res.text();

      let json;
      try {
        json = JSON.parse(textResponse);
      } catch {
        throw new Error(`Server Error (${res.status}): Endpoint tidak valid`);
      }

      if (!res.ok) throw new Error(json.message || "Gagal memproses dukungan");

      setUpvoteData((prev) => ({
        ...prev,
        [reportId]: {
          count: json.data.upvoteCount,
          hasVoted: json.data.upvoted,
        },
      }));
    } catch (err) {
      setUpvoteData((prev) => ({
        ...prev,
        [reportId]: previousState || { count: 0, hasVoted: false },
      }));

      console.error("[Upvote Error]:", err);
      toast.error("Gagal memproses dukungan. Pastikan kamu sudah login.");
    } finally {
      pendingReqs.current.delete(reportId);
    }
  }, []);

  const hasVoted = useCallback(
    (id: string) => upvoteData[id]?.hasVoted ?? false,
    [upvoteData],
  );
  const getCount = useCallback(
    (id: string) => upvoteData[id]?.count ?? 0,
    [upvoteData],
  );

  return { toggle, hasVoted, getCount, sync };
}
