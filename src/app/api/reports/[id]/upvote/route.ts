import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { upvoteService } from "@/services/upvote.service";
import { ok, unauthorized, serverError } from "@/lib/api-response";

// POST /api/reports/[id]/upvote
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Format async params Next.js 15
) {
  const session = await auth();

  // Wajib login untuk melakukan upvote
  if (!session) {
    return unauthorized(
      "Silakan login terlebih dahulu untuk mendukung laporan",
    );
  }

  try {
    const resolvedParams = await params;

    // Panggil service upvote (sudah menghandle logika toggle dan update count)
    const result = await upvoteService.toggle(
      session.user.id,
      resolvedParams.id,
    );

    // Mengembalikan object { upvoted: boolean, upvoteCount: number }
    return ok(result);
  } catch (err) {
    console.error("[POST /api/reports/[id]/upvote]", err);
    return serverError("Gagal memproses dukungan laporan");
  }
}
