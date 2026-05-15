// src/app/api/auth/register/route.ts

import { type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { badRequest, conflict, created, serverError } from "@/lib/api-response";

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Minimal 8 karakter")
    .regex(/[A-Z]/, "Harus mengandung huruf kapital")
    .regex(/[0-9]/, "Harus mengandung angka"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return badRequest("Data tidak valid", parsed.error.flatten().fieldErrors);
    }

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return conflict("Email sudah terdaftar");

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return created(user);
  } catch {
    return serverError();
  }
}

// import { NextRequest } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { badRequest, conflict, created, serverError } from "@/lib/api-response";
// import bcrypt from "bcryptjs";
// import { z } from "zod";

// const registerSchema = z
//   .object({
//     name: z.string().min(2, "Nama minimal 2 karakter").max(100),
//     email: z.string().email("Format email tidak valid"),
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
//     const body = await req.json();
//     const parsed = registerSchema.safeParse(body);

//     if (!parsed.success) {
//       return badRequest("Data tidak valid", parsed.error.flatten().fieldErrors);
//     }

//     const { name, email, password } = parsed.data;

//     const existing = await prisma.user.findUnique({ where: { email } });
//     if (existing) return conflict("Email sudah terdaftar");

//     const hashed = await bcrypt.hash(password, 12);
//     const user = await prisma.user.create({
//       data: { name, email, password: hashed },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         role: true,
//         createdAt: true,
//       },
//     });

//     return created(user);
//   } catch (err) {
//     console.error("[register]", err);
//     return serverError();
//   }
// }
