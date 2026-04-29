"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Bell } from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";

// Page title mapping — sesuaikan dengan route kamu
const PAGE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  "/dashboard/overview": { title: "Beranda", subtitle: "Ringkasan aktivitas" },
  "/dashboard/map": {
    title: "Peta Sebaran",
    subtitle: "Pantau kerusakan jalan",
  },
  "/dashboard/report": {
    title: "Daftar Laporan",
    subtitle: "Daftar laporan kerusakan jalan",
  },
  "/dashboard/report/new": {
    title: "Buat Laporan",
    subtitle: "Laporkan kerusakan",
  },
  "/dashboard/profile": { title: "Profil", subtitle: "Akun & pencapaian" },
  "/dashboard/playground": {
    title: "StreetWatch AI",
    subtitle: "Tanya asisten AI",
  },
};

function getPageMeta(pathname: string) {
  // exact match first, then prefix match
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const key = Object.keys(PAGE_TITLES).find((k) => pathname.startsWith(k));
  return key
    ? PAGE_TITLES[key]
    : { title: "Street Watch", subtitle: undefined };
}

export function MobileHeader() {
  const pathname = usePathname();
  const { title, subtitle } = getPageMeta(pathname ?? "");

  return (
    <header className="sm:hidden flex items-center justify-between px-4 h-14 shrink-0 bg-background/80 backdrop-blur-md border-b border-border/60">
      {/* Brand mark + page title */}
      <div className="flex items-center gap-2.5">
        <Link
          href="/dashboard/overview"
          className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary shrink-0"
        >
          <MapPin className="w-3.5 h-3.5 text-primary-foreground" />
        </Link>
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
        <button className="relative flex items-center justify-center w-8 h-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
          <Bell className="w-4 h-4" />
          {/* Unread dot */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>

        {/* Theme toggle — reuse your existing component */}
        <ThemeToggle />
      </div>
    </header>
  );
}
