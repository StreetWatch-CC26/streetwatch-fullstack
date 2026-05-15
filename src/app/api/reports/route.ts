import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { reportService } from "@/services/report.service";
import {
  createReportSchema,
  reportQuerySchema,
} from "@/validations/report.validation";
import {
  ok,
  created,
  badRequest,
  unauthorized,
  serverError,
} from "@/lib/api-response";

// GET /api/reports — Mengambil daftar laporan (bisa diakses publik)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    // Ubah searchParams menjadi object biasa
    const queryParams = Object.fromEntries(searchParams.entries());

    // Validasi query (pagination, filter, sort)
    const query = reportQuerySchema.safeParse(queryParams);
    if (!query.success) {
      return badRequest(
        "Parameter tidak valid",
        query.error.flatten().fieldErrors,
      );
    }

    const { page, limit, sort, ...filters } = query.data;

    // Panggil service untuk get data dari DB
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

// POST /api/reports — Membuat laporan baru (wajib login)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return unauthorized("Anda harus login untuk membuat laporan");

  try {
    const body = await req.json();

    // Validasi payload body
    const parsed = createReportSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest(
        "Data laporan tidak valid",
        parsed.error.flatten().fieldErrors,
      );
    }

    // Panggil service create (Service ini akan memanggil DB lalu trigger FastAPI AI)
    const report = await reportService.create(session.user.id, parsed.data);

    return created(report);
  } catch (err) {
    console.error("[POST /api/reports]", err);
    return serverError("Gagal menyimpan laporan");
  }
}
