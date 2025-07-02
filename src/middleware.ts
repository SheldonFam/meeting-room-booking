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
  const isTokenValid = token ? await verifyToken(token) : null;

  // Redirect authenticated users away from /login
  if (pathname === "/login" && isTokenValid) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect main app routes
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  if (!isProtected) return NextResponse.next();

  if (!token || !isTokenValid) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
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
