import { NextRequest } from "next/server";
import { reportService } from "@/services/report.service";
import { ok, serverError } from "@/lib/api-response";
import { auth } from "@/lib/auth";

// GET /api/reports/map?provinsi=Riau&kota=Kota+Pekanbaru
export async function GET(req: NextRequest) {
  try {
    const session = await auth(); // Cek user login
    const { searchParams } = req.nextUrl;

    const provinsi = searchParams.get("provinsi") ?? undefined;
    const kota = searchParams.get("kota") ?? undefined;

    // ⬅️ Teruskan session?.user?.id ke service
    const data = await reportService.getForMap(
      { provinsi, kota },
      session?.user?.id,
    );

    return ok(data);
  } catch (err) {
    console.error("[GET /reports/map]", err);
    return serverError("Gagal mengambil data sebaran peta");
  }
}
