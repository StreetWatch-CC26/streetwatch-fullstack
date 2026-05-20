"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  RiPieChart2Fill,
  RiCompassDiscoverFill,
  RiAddCircleFill,
  // RiFlaskFill,
  RiMenuFill,
  RiGlobalFill,
} from "@remixicon/react";

import { User, FileText, LogOut, ChevronRight } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

// Navigasi Utama (Bottom Bar)
const mainNavItems = [
  { title: "Overview", url: "/dashboard/overview", icon: RiPieChart2Fill },
  { title: "Peta", url: "/dashboard/map", icon: RiCompassDiscoverFill },
  {
    title: "Lapor",
    url: "/dashboard/reports/new",
    icon: RiAddCircleFill,
    cta: true,
  },
  { title: "Profil", url: "/dashboard/profile", icon: User },
  // { title: "AI", url: "/dashboard/playground", icon: RiFlaskFill },
];

// Menu Dalam (Drawer)
const menuGroups = [
  // {
  //   title: "Akun Saya",
  //   items: [
  //     { label: "Profil Pengguna", icon: User, url: "/dashboard/profile" },
  //   ],
  // },
  {
    title: "Aktivitas",
    items: [
      { label: "Laporan Saya", icon: FileText, url: "/dashboard/reports" },
    ],
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  return (
    <>
      <nav
        className={cn(
          "sm:hidden",
          "fixed bottom-4 left-4 right-4",
          "z-1000",
          "h-16 flex items-center justify-around",
          "rounded-2xl border border-border/60",
          "bg-background/85 backdrop-blur-xl",
          "shadow-[0_8px_32px_-4px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.04)]",
          "px-1",
        )}
      >
        {/* Render 4 item pertama seperti biasa */}
        {mainNavItems.map((item) => {
          const isActive = pathname?.startsWith(item.url) ?? false;
          const isCta = item.cta;

          return (
            <Link
              key={item.url}
              href={item.url}
              onClick={() => setIsDrawerOpen(false)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5",
                "flex-1 h-full rounded-xl transition-all duration-200",
                "select-none tap-highlight-transparent",
                isActive && !isCta ? "text-primary" : "text-muted-foreground",
                !isActive && "hover:text-foreground",
              )}
            >
              {isCta ? (
                <div
                  className={cn(
                    "flex flex-col items-center justify-center",
                    "w-12 h-12 -mt-5 rounded-2xl",
                    "bg-primary shadow-lg shadow-primary/35",
                    "transition-transform duration-150 active:scale-95",
                    isActive && "ring-4 ring-primary/20",
                  )}
                >
                  <item.icon className="h-6 w-6 text-primary-foreground" />
                </div>
              ) : (
                <>
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-7 rounded-lg transition-all duration-200",
                      isActive ? "bg-primary/10" : "bg-transparent",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "transition-all duration-200",
                        isActive ? "h-5.5 w-5.5" : "h-5 w-5",
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-[9px] font-medium leading-none transition-all duration-200",
                      isActive ? "opacity-100" : "opacity-60",
                    )}
                  >
                    {item.title}
                  </span>
                </>
              )}
              {isCta && (
                <span
                  className={cn(
                    "text-[9px] font-medium leading-none mt-0.5",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground opacity-60",
                  )}
                >
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}

        {/* Item Menu Terakhir -> Membuka Drawer */}
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <button
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5",
                "flex-1 h-full rounded-xl transition-all duration-200",
                "select-none tap-highlight-transparent text-muted-foreground hover:text-foreground",
                isDrawerOpen && "text-primary",
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-7 rounded-lg transition-all duration-200",
                  isDrawerOpen ? "bg-primary/10" : "bg-transparent",
                )}
              >
                <RiMenuFill
                  className={cn(
                    "transition-all duration-200",
                    isDrawerOpen ? "h-5.5 w-5.5" : "h-5 w-5",
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[9px] font-medium leading-none transition-all duration-200",
                  isDrawerOpen ? "opacity-100" : "opacity-60",
                )}
              >
                Lainnya
              </span>
            </button>
          </DrawerTrigger>

          <DrawerContent
            aria-describedby="Menu lainnya"
            className="z-1100 bg-background/95 backdrop-blur-xl border-t border-border"
          >
            <div className="mx-auto w-full max-w-sm px-4 pb-8 pt-4">
              <DrawerHeader className="text-left px-0 pb-4">
                <DrawerTitle className="text-lg font-bold">
                  Menu Street Watch
                </DrawerTitle>
                <DrawerDescription className="sr-only">
                  Akses fitur lainnya seperti laporan saya, pengaturan akun, dan
                  lainnya.
                </DrawerDescription>
              </DrawerHeader>

              <div className="space-y-6">
                {menuGroups.map((group, idx) => (
                  <div key={idx}>
                    <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                      {group.title}
                    </h4>
                    <div className="flex flex-col gap-1 bg-card rounded-xl p-2 border border-border/50">
                      {group.items.map((item, itemIdx) =>
                        item.url ? (
                          <Link
                            key={itemIdx}
                            href={item.url}
                            onClick={() => setIsDrawerOpen(false)}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/60 transition-colors active:scale-[0.98]"
                          >
                            <div className="flex items-center gap-3 text-sm font-medium">
                              <item.icon className="w-5 h-5 text-muted-foreground" />
                              {item.label}
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                          </Link>
                        ) : (
                          <button
                            key={itemIdx}
                            onClick={() => {}}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/60 transition-colors active:scale-[0.98]"
                          >
                            <div className="flex items-center gap-3 text-sm font-medium">
                              <item.icon className="w-5 h-5 text-muted-foreground" />
                              {item.label}
                            </div>
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                ))}

                <button className="flex items-center gap-3 p-3 w-full rounded-lg text-destructive hover:bg-destructive/10 transition-colors active:scale-[0.98]">
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-semibold">Keluar Akun</span>
                </button>

                <Link
                  href="/"
                  className="flex items-center gap-3 p-3 w-full rounded-lg text-primary hover:bg-primary/10 transition-colors active:scale-[0.98]"
                >
                  <RiGlobalFill className="w-5 h-5" />
                  <span className="text-sm font-semibold">Public Site</span>
                </Link>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </nav>
    </>
  );
}
