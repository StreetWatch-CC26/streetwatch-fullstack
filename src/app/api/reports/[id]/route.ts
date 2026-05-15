import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { reportService } from "@/services/report.service";
import { ok, notFound, serverError } from "@/lib/api-response";

// GET /api/reports/[id] — Mengambil detail 1 laporan berdasarkan ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Format Next.js 15
) {
  try {
    // Resolve params terlebih dahulu (Next.js 15 requirement)
    const resolvedParams = await params;

    // Cek session untuk melihat apakah user sudah pernah upvote (opsional)
    const session = await auth();

    const report = await reportService.getById(
      resolvedParams.id,
      session?.user?.id,
    );

    if (!report) {
      return notFound("Laporan tidak ditemukan");
    }

    return ok(report);
  } catch (err: unknown) {
    console.error("[GET /api/reports/[id]]", err);
    if (err instanceof Error && err.message === "NOT_FOUND")
      return notFound("Laporan tidak ditemukan");
    return serverError("Terjadi kesalahan saat memuat detail laporan");
  }
}
