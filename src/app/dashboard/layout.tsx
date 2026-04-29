import { AppSidebar } from "@/components/app-sidebar";
import { MobileBottomNav } from "@/components/shared/MobileBottomNav";
import { MobileHeader } from "@/components/shared/MobileHeader";
import ThemeToggle from "@/components/shared/ThemeToggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Street Watch</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center px-4">
            <ThemeToggle />
          </div>
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
