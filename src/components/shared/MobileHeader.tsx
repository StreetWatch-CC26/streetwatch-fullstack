"use client";

import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { AddReportBtn } from "./AddReportBtn";
import { BackButton } from "./BackButton";
import { getPageMeta } from "@/lib/utils";

export function MobileHeader() {
  const pathname = usePathname();
  const { title, subtitle } = getPageMeta(pathname ?? "");
  const showAddReportBtn =
    pathname === "/dashboard/reports" || pathname === "/dashboard/map";

  return (
    <header className="sm:hidden flex items-center justify-between px-4 h-14 shrink-0 bg-background/80 backdrop-blur-md border-b border-border/60">
      {/* back button + page title */}
      <div className="flex items-center gap-2.5">
        <BackButton />
        <Separator orientation="vertical" />
        <div className="leading-none">
          <p className="text-sm font-semibold text-foreground leading-tight">
            {title}
          </p>
          {subtitle && (
            <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Notification bell */}
        {/* <button className="relative flex items-center justify-center w-8 h-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
          <Bell className="w-4 h-4" /> */}
        {/* Unread dot */}
        {/* <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
        </button> */}

        {showAddReportBtn && <AddReportBtn />}

        <ThemeToggle />
      </div>
    </header>
  );
}
