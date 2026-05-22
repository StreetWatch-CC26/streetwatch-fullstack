"use client";

import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "./BackButton";
import { getPageMeta } from "@/lib/utils";

export function MobileHeader() {
  const pathname = usePathname();
  const { title } = getPageMeta(pathname ?? "");

  // hide pada halaman dashboard/reports
  if (pathname?.startsWith("/dashboard/reports")) return null;

  return (
    <header className="sm:hidden flex items-center justify-between px-4 h-14 shrink-0 bg-background/80 backdrop-blur-md border-b border-border/60">
      {/* back button + page title */}
      <div className="flex items-center gap-2.5">
        <BackButton />
        <Separator orientation="vertical" />
        <div className="leading-none">
          <p className="text-base font-semibold text-foreground leading-tight">
            {title}
          </p>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2.5">
        <Separator orientation="vertical" />
        <ThemeToggle />
      </div>
    </header>
  );
}
