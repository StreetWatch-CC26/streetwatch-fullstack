// src/hooks/useAuth.ts
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const refreshSession = useCallback(async () => {
    // Setelah set-password berhasil, update JWT token di session
    await update({ hasPassword: true });
  }, [update]);

  return {
    user: session?.user ?? null,
    isLoading: status === "loading",
    isLoggedIn: status === "authenticated",
    hasPassword: session?.user.hasPassword ?? false,
    refreshSession,
    router,
  };
}
