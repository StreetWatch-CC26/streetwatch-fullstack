import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { reportService } from "@/services/report.service";
import {
  createReportSchema,
  reportQuerySchema,
} from "@/validations/report.validation";
import {
  MLNotRoadError,
  MLServiceError,
  MLNoDamageError,
} from "@/services/ml.service";
import {
  ok,
  created,
  badRequest,
  unauthorized,
  serverError,
  unprocessableEntity,
  serviceUnavailable,
} from "@/lib/api-response";

// GET /api/reports — Mengambil daftar laporan (bisa diakses publik)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const queryParams = Object.fromEntries(searchParams.entries());

    const query = reportQuerySchema.safeParse(queryParams);
    if (!query.success) {
      return badRequest(
        "Parameter tidak valid",
        query.error.flatten().fieldErrors,
      );
    }

    const { page, limit, sort, ...filters } = query.data;

    const { data, total } = await reportService.getAll(filters, {
      page,
      limit,
      sort,
    });

    const totalPages = Math.ceil(total / limit);
    return ok(data, {
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error("[GET /api/reports]", err);
    return serverError("Gagal mengambil data laporan");
  }
}

// POST /api/reports — Membuat laporan baru
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return unauthorized("Anda harus login untuk membuat laporan");

  try {
    const body = await req.json();

    const parsed = createReportSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(
        "Data laporan tidak valid",
        parsed.error.flatten().fieldErrors,
      );
    }

    const report = await reportService.create(
      session.user.id,
      parsed.data,
      req.signal,
    );

    return created(report);
  } catch (err) {
    // 422 Unprocessable Entity - Kegagalan validasi gambar (Bukan jalan ATAU tidak ada rusak)
    if (err instanceof MLNotRoadError || err instanceof MLNoDamageError) {
      return unprocessableEntity(err.message);
    }

    // 503 Service Unavailable - Masalah koneksi / server AI down
    if (err instanceof MLServiceError) {
      console.error("[POST /api/reports] ML error:", err.message);
      return serviceUnavailable(err.message);
    }

    // 500 Internal Server Error - Error tak terduga lainnya
    console.error("[POST /api/reports]", err);
    return serverError("Gagal menyimpan laporan");
  }
}
