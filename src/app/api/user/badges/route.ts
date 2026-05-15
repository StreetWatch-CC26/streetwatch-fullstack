// src/app/api/user/badges/route.ts

import { auth } from "@/lib/auth";
import { userService } from "@/services/user.service";
import { ok, serverError, unauthorized } from "@/lib/api-response";

export async function GET() {
  const session = await auth();
  if (!session) return unauthorized();

  try {
    const badges = await userService.getBadges(session.user.id);
    return ok(badges);
  } catch {
    return serverError();
  }
}
