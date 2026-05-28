/**
 * app/api/reports/export/route.ts
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { reportService } from "@/services/report.service";
import type { ReportFilters } from "@/repositories/report.repository";
import type { Urgency } from "@/generated/prisma/enums";
import { unauthorized } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return unauthorized("Anda harus login untuk mengekspor data");
    }

    const { searchParams } = req.nextUrl;

    const provinsi = searchParams.get("provinsi") || undefined;
    const kota = searchParams.get("kota") || undefined;
    const urgency = searchParams.get("urgency") || undefined;
    const dateFrom = searchParams.get("dateFrom") || undefined;
    const dateTo = searchParams.get("dateTo") || undefined;

    const filters: ReportFilters = {
      ...(provinsi && { provinsi }),
      ...(kota && { kota }),
      ...(urgency && { urgency: urgency as Urgency }),
      ...(dateFrom && { dateFrom: new Date(dateFrom) }),
      ...(dateTo && { dateTo: new Date(dateTo) }),
    };

    const { data, total } = await reportService.getForExport(
      filters,
      session?.user?.id,
    );

    return NextResponse.json({
      success: true,
      data,
      meta: {
        total,
        generatedAt: new Date().toISOString(),
        filters: { provinsi, kota, urgency, dateFrom, dateTo },
      },
    });
  } catch (err) {
    console.error("[Export API Error]", err);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data export" },
      { status: 500 },
    );
  }
}
