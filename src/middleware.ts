import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

const PROTECTED_PATHS = [
  "/",
  "/dashboard",
  "/calendar",
  "/rooms",
  "/my-bookings",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const payload = token ? await verifyToken(token) : null;
  const isTokenValid = !!payload;

  // Redirect authenticated users away from /login
  if (pathname === "/login" && isTokenValid) {
    // Role-based redirect
    const role = payload?.role?.toLowerCase();
    const redirectPath = role === "admin" ? "/admin/dashboard" : "/dashboard";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Protect main app routes
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  if (!isProtected) return NextResponse.next();

  if (!token || !isTokenValid) {
    const loginUrl = new URL("/login", request.url);
    // If user tries to access root, set from to dashboard
    let from = pathname;
    if (pathname === "/") {
      from = "/dashboard";
    }
    loginUrl.searchParams.set("from", from);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/calendar",
    "/rooms/:path*",
    "/my-bookings",
    "/login",
  ],
};
