import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "CITIZEN" | "ADMIN";
      hasPassword: boolean;
      justRegistered?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role: "CITIZEN" | "ADMIN";
    hasPassword: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "CITIZEN" | "ADMIN";
    hasPassword?: boolean;
    justRegistered?: boolean;
  }
}
