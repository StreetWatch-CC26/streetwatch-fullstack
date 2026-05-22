"use client";

import { AnalyticsSection } from "@/components/overview/AnalyticsSection";
// import { ReportListSection } from "@/components/overview/ReportListSection";

export default function DashboardPage() {
  return (
    <div className="px-4 py-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Overview Analytics
        </h1>
        <p className="text-sm text-muted-foreground">
          Gambaran keseluruhan laporan infrastruktur jalan di Indonesia
        </p>
      </div>

      <AnalyticsSection />

      {/* <ReportListSection /> */}
    </div>
  );
}
