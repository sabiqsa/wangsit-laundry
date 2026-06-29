import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl, auth: session } = req as NextRequest & { auth: { user?: { role: string } } | null };
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isClientRoute = nextUrl.pathname.startsWith("/client") || nextUrl.pathname.startsWith("/history");
  const isAuthRoute = nextUrl.pathname.startsWith("/auth");

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && isAuthRoute) {
    if (role === "admin") return NextResponse.redirect(new URL("/admin", nextUrl));
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Protect admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/auth/login", nextUrl));
    if (role !== "admin") return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Protect client-only routes
  if (isClientRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/auth/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/client/:path*",
    "/history/:path*",
    "/auth/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*|icons).*)",
  ],
};
