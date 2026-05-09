import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const PROTECTED = [
  "/dashboard/map",
  "/dashboard/reports",
  "/dashboard/reports/new",
  "/dashboard/reports/:id",
  "/dashboard/profile",
  "/dashboard/playground",
  "/dashboard/overview",
];

const AUTH_ONLY = ["/login", "/register"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const completedOnboarding =
    req.cookies.get("has-completed-onboarding")?.value === "true";

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_ONLY.some((p) => pathname.startsWith(p));

  // Belum login → redirect ke /login
  if (isProtected && !session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Sudah login → tidak perlu ke halaman auth
  if (isAuthPage && session) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard/map";
    return NextResponse.redirect(url);
  }

  if (!completedOnboarding && !pathname.startsWith("/welcome")) {
    const url = req.nextUrl.clone();
    url.pathname = "/welcome";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
