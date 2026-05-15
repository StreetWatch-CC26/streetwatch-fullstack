// src/app/api/user/reports/route.ts

import { auth } from "@/lib/auth";
import { userService } from "@/services/user.service";
import { ok, serverError, unauthorized } from "@/lib/api-response";

export async function GET() {
  const session = await auth();
  if (!session) return unauthorized();

  try {
    const reports = await userService.getReports(session.user.id);
    return ok(reports);
  } catch {
    return serverError();
  }
}
