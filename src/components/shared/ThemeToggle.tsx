"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * useSyncExternalStore-based mount detection.
 *
 * - `getServerSnapshot` always returns `false`  → server render is always "not mounted"
 * - `getSnapshot`       always returns `true`   → client is always "mounted"
 * - No useState, no useEffect, no setState-in-effect lint error.
 * - React reconciles the difference once silently after hydration.
 *
 * This is the officially recommended pattern from the React team for
 * "client-only" values that are unknown at SSR time.
 * See: https://tkdodo.eu/blog/avoiding-hydration-mismatches-with-usesyncexternalstore
 */
function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {}, // subscribe — nothing to subscribe to
    () => true, // getSnapshot (client) — always mounted
    () => false, // getServerSnapshot — never mounted on server
  );
}

export default function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isMounted = useIsMounted();

  // Before mount: isDark is false → thumb sits at translate-x-1 (light position)
  // This makes server HTML === first client paint → no hydration mismatch
  const isDark = isMounted && resolvedTheme === "dark";

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-8 w-14 items-center rounded-full transition-colors",
        "cursor-pointer select-none",
        "bg-muted hover:bg-muted/80",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full",
          "bg-background shadow-md transition-transform duration-200",
          isDark ? "translate-x-7" : "translate-x-1",
        )}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5" />
        ) : (
          <Sun className="h-3.5 w-3.5" />
        )}
      </span>
    </button>
  );
}
