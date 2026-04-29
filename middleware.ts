import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  //   const token = request.cookies.get("session-token")?.value;
  //   const userRole = request.cookies.get("user-role")?.value;
  //   const hasOnboarded = request.cookies.get("has-completed-onboarding")?.value;

  //   const { pathname } = request.nextUrl;

  //   // 1. Cek Onboarding (Jika belum onboarding dan bukan di halaman onboarding)
  //   if (
  //     !hasOnboarded &&
  //     pathname !== "/welcome" &&
  //     !pathname.startsWith("/_next")
  //   ) {
  //     return NextResponse.redirect(new URL("/welcome", request.url));
  //   }

  //   // 2. Proteksi Admin (Contoh dengan Toast trigger)
  //   if (pathname.startsWith("/dashboard")) {
  //     if (!token || (userRole !== "admin" && userRole !== "super_admin")) {
  //       const url = new URL("/login", request.url);
  //       url.searchParams.set("error", "unauthorized"); // Sinyal untuk Toast
  //       return NextResponse.redirect(url);
  //     }
  //   }

  //   // 3. Jika sudah login tapi coba akses login page lagi
  //   if (token && pathname === "/login") {
  //     const url = new URL("/home", request.url);
  //     url.searchParams.set("success", "welcome"); // Sinyal untuk Toast
  //     return NextResponse.redirect(url);
  //   }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
