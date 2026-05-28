// src/lib/auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user?.password) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          hasPassword: true,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,

    // Override callback jwt untuk menyuntikkan data dari Prisma
    async jwt({ token, user, account, trigger, session }) {
      // 1. Eksekusi callback bawaan dari authConfig terlebih dahulu
      let finalToken = token;
      if (authConfig.callbacks?.jwt) {
        finalToken = await authConfig.callbacks.jwt({
          token,
          user,
          trigger,
          session,
        });
      }

      // 2. Logika KHUSUS Google Login (Hanya dieksekusi saat login pertama kali via OAuth)
      if (account?.provider === "google" && user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { password: true, role: true },
        });

        finalToken.hasPassword = !!dbUser?.password;
        finalToken.role = dbUser?.role ?? "CITIZEN";
        // Flag ini berguna untuk middleware mengarahkan ke halaman set-password
        finalToken.justRegistered = !dbUser?.password;
      }

      // 3. Fallback jika token lama tidak memiliki data hasPassword/role
      if (finalToken.id && finalToken.hasPassword === undefined) {
        const dbUser = await prisma.user.findUnique({
          where: { id: finalToken.id as string },
          select: { password: true, role: true },
        });
        finalToken.hasPassword = !!dbUser?.password;
        finalToken.role = dbUser?.role ?? "CITIZEN";
      }

      return finalToken;
    },
  },
});
