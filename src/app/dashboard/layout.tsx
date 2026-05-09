import { AppSidebar } from "@/components/sidebar/AppSidebar";
import {
  LeftDashboardHeader,
  RightDashboardHeader,
} from "@/components/shared/DashboardHeader";
import { MobileBottomNav } from "@/components/shared/MobileBottomNav";
import { MobileHeader } from "@/components/shared/MobileHeader";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* ── Desktop sidebar — hidden on mobile ── */}
      <div className="hidden sm:block">
        <AppSidebar />
      </div>

      <SidebarInset>
        {/* ── Desktop header — hidden on mobile ── */}
        <header className="hidden sm:flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex justify-center items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <LeftDashboardHeader />
          </div>
          <RightDashboardHeader />
        </header>

        {/* ── Mobile header — hidden on desktop ── */}
        <MobileHeader />

        {/*
          ── Page content container ──
          Mobile  : 100dvh - mobile header (56px) - bottom nav (80px) - gap (12px) ≈ 156px total
          Desktop : 100dvh - desktop header (65px)
        */}
        <div className="overflow-hidden">{children}</div>
      </SidebarInset>

      {/* ── Mobile bottom nav — hidden on desktop ── */}
      <MobileBottomNav />
    </SidebarProvider>
  );
}
