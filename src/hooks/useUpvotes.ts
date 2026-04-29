"use client";

/**
 * hooks/useUpvotes.ts
 *
 * In-memory upvote state.
 * Produksi: ganti toggle() dengan API call + optimistic update.
 */

import { useState, useCallback } from "react";

export function useUpvotes(initial: Record<string, number>) {
  const [counts, setCounts] = useState<Record<string, number>>(initial);
  const [voted, setVoted] = useState<Set<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setVoted((prev) => {
      const next = new Set(prev);
      const delta = next.has(id) ? -1 : 1;
      next.has(id) ? next.delete(id) : next.add(id);
      setCounts((c) => ({ ...c, [id]: (c[id] ?? 0) + delta }));
      return next;
    });
  }, []);

  const hasVoted = useCallback((id: string) => voted.has(id), [voted]);
  const getCount = useCallback((id: string) => counts[id] ?? 0, [counts]);

  return { toggle, hasVoted, getCount };
}
