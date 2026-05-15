// src/app/api/user/me/route.ts

import { type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { userService } from "@/services/user.service";
import { updateProfileSchema } from "@/validations/user.validation";
import {
  badRequest,
  notFound,
  ok,
  serverError,
  unauthorized,
} from "@/lib/api-response";

export async function GET() {
  const session = await auth();
  if (!session) return unauthorized();

  try {
    const profile = await userService.getProfile(session.user.id);
    return ok(profile);
  } catch (err) {
    if (err instanceof Error && err.message === "NOT_FOUND")
      return notFound("User tidak ditemukan");
    return serverError();
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return unauthorized();

  try {
    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success)
      return badRequest("Data tidak valid", parsed.error.flatten().fieldErrors);

    const updated = await userService.updateProfile(
      session.user.id,
      parsed.data,
    );
    return ok(updated);
  } catch {
    return serverError();
  }
}
