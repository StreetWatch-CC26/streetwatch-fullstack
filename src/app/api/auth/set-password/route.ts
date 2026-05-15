// src/app/api/user/set-password/route.ts

import { type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  badRequest,
  conflict,
  ok,
  serverError,
  unauthorized,
} from "@/lib/api-response";

const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Minimal 8 karakter")
      .regex(/[A-Z]/, "Harus mengandung huruf kapital")
      .regex(/[0-9]/, "Harus mengandung angka"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return unauthorized();

  try {
    const body = await req.json();
    const parsed = setPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Data tidak valid", parsed.error.flatten().fieldErrors);
    }

    // Cek apakah user sudah punya password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (user?.password) {
      return conflict("Password sudah diset. Gunakan fitur ganti password.");
    }

    const hashed = await bcrypt.hash(parsed.data.password, 12);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashed },
    });

    return ok({ message: "Password berhasil disimpan" });
  } catch {
    return serverError();
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { badRequest, serverError } from "@/lib/api-response";
// import bcrypt from "bcryptjs";
// import { z } from "zod";
// import { auth } from "@/lib/auth";

// const setPasswordSchema = z
//   .object({
//     password: z
//       .string()
//       .min(8, "Password minimal 8 karakter")
//       .regex(/[A-Z]/, "Harus mengandung huruf kapital")
//       .regex(/[0-9]/, "Harus mengandung angka"),
//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Password dan konfirmasi tidak cocok",
//     path: ["confirmPassword"],
//   });

// export async function POST(req: NextRequest) {
//   try {
//     // 1. Cek sesi user (Hanya user login yang bisa set password)
//     const session = await auth();
//     if (!session?.user?.id) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     // 2. Validasi input
//     const body = await req.json();
//     const parsed = setPasswordSchema.safeParse(body);

//     if (!parsed.success) {
//       return badRequest("Data tidak valid", parsed.error.flatten().fieldErrors);
//     }

//     // 3. Hash password dan simpan ke database
//     const { password } = parsed.data;
//     const hashed = await bcrypt.hash(password, 12);

//     await prisma.user.update({
//       where: { id: session.user.id },
//       data: { password: hashed },
//     });

//     return NextResponse.json(
//       { message: "Password berhasil disimpan" },
//       { status: 200 },
//     );
//   } catch (err) {
//     console.error("[set-password]", err);
//     return serverError();
//   }
// }
