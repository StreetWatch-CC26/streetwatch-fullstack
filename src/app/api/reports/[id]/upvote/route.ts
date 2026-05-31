import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { upvoteService } from "@/services/upvote.service";
import { ok, unauthorized, serverError } from "@/lib/api-response";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  // console.log("[Upvote] Session:", JSON.stringify(session?.user ?? null));

  if (!session?.user?.id) {
    return unauthorized(
      "Silakan login terlebih dahulu untuk mendukung laporan",
    );
  }

  try {
    const { id } = await params;
    const result = await upvoteService.toggle(session.user.id, id);
    return ok(result);
  } catch (err) {
    console.error("[POST /api/reports/[id]/upvote]", err);
    return serverError("Gagal memproses dukungan laporan");
  }
}
