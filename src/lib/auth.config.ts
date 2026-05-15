// src/lib/auth.config.ts

import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.hasPassword = user.hasPassword;
      }

      // Update session (misal: setelah set-password berhasil atau user menekan 'skip')
      if (trigger === "update" && session?.hasPassword !== undefined) {
        token.hasPassword = session.hasPassword as boolean;
        token.justRegistered = false; // Matikan flag jika sudah di-update/skip
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "CITIZEN" | "ADMIN") ?? "CITIZEN";
        session.user.hasPassword = (token.hasPassword as boolean) ?? false;

        // Teruskan flag ke client jika perlu
        if (token.justRegistered !== undefined) {
          session.user.justRegistered =
            (token.justRegistered as boolean) ?? false;
        }
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
