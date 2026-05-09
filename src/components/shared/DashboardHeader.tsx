"use client";

import { AddReportBtn } from "@/components/shared/AddReportBtn";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ThemeToggle from "./ThemeToggle";
import { getPageMeta } from "@/lib/utils";

export function LeftDashboardHeader() {
  const pathname = usePathname();
  const { title } = getPageMeta(pathname ?? "");

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}

export function RightDashboardHeader() {
  const pathname = usePathname();
  const showAddReportBtn =
    pathname === "/dashboard/reports" || pathname === "/dashboard/map";

  return (
    <div className="flex items-center gap-3 pe-4">
      {showAddReportBtn && <AddReportBtn />}

      <ThemeToggle />
    </div>
  );
}
