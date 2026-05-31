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
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.hasPassword = user.hasPassword;
      }
      if (trigger === "update" && session?.hasPassword !== undefined) {
        token.hasPassword = session.hasPassword as boolean;
        token.justRegistered = false;
      }

      if (account?.provider === "google" && user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { password: true, role: true },
        });
        token.hasPassword = !!dbUser?.password;
        token.role = dbUser?.role ?? "CITIZEN";
        token.justRegistered = !dbUser?.password;
      }

      if (token.id && token.hasPassword === undefined) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { password: true, role: true },
        });
        token.hasPassword = !!dbUser?.password;
        token.role = dbUser?.role ?? "CITIZEN";
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "CITIZEN" | "ADMIN") ?? "CITIZEN";
        session.user.hasPassword = (token.hasPassword as boolean) ?? false;
        if (token.justRegistered !== undefined) {
          session.user.justRegistered =
            (token.justRegistered as boolean) ?? false;
        }
      }
      return session;
    },
  },
});
