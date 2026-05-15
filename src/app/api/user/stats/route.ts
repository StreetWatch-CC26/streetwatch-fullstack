// src/app/api/user/stats/route.ts

import { auth } from "@/lib/auth";
import { userService } from "@/services/user.service";
import { ok, serverError, unauthorized } from "@/lib/api-response";

export async function GET() {
  const session = await auth();
  if (!session) return unauthorized();

  try {
    const stats = await userService.getStats(session.user.id);
    return ok(stats);
  } catch {
    return serverError();
  }
}
