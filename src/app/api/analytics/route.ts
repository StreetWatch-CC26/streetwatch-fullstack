import { NextRequest } from "next/server";
import { analyticsService } from "@/services/analytics.service";
import { ok, serverError } from "@/lib/api-response";

// GET /api/analytics?type=overview|monthly|locations|categories&months=12
export async function GET(req: NextRequest) {
  try {
    const type = req.nextUrl.searchParams.get("type") ?? "overview";
    const months = Number(req.nextUrl.searchParams.get("months") ?? 12);

    switch (type) {
      case "monthly":
        // Grafik tren pelaporan per bulan
        return ok(await analyticsService.getMonthlyTrend(months));

      case "locations":
        // Peringkat kota dengan jalan rusak terbanyak
        return ok(await analyticsService.getTopLocations());

      case "categories":
        // Pie chart rasio kategori kerusakan (lubang, retak, dll)
        return ok(await analyticsService.getCategoryBreakdown());

      case "overview":
      default:
        // Summary Cards (Total laporan, jumlah fail, jumlah verified)
        return ok(await analyticsService.getOverview());
    }
  } catch (err) {
    console.error("[GET /api/analytics]", err);
    return serverError("Gagal mengambil data analitik");
  }
}
