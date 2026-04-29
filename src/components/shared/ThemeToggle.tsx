"use client";

import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-8 w-14 items-center rounded-full transition-colors",
        "cursor-pointer",
        "bg-muted hover:bg-muted/80",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full bg-background shadow-md transition-transform",
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
