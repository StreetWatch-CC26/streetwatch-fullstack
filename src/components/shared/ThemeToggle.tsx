"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isMounted = useIsMounted();

  const isDark = isMounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex items-center rounded-full",
        "h-6 w-11 p-1",
        "sm:h-8 sm:w-14",
        "bg-muted hover:bg-muted/80",
        "transition-colors duration-200",
        "cursor-pointer select-none",
        className,
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-full",
          "bg-background shadow-md",
          "transition-transform duration-200",
          "h-4 w-4 text-[10px]",
          "sm:h-6 sm:w-6 sm:text-xs",
          isDark ? "translate-x-5 sm:translate-x-6" : "translate-x-0",
        )}
      >
        {isDark ? (
          <Moon className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
        ) : (
          <Sun className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
        )}
      </span>
    </button>
  );
}
