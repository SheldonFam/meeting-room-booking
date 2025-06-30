import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

const PROTECTED_PATHS = ["/dashboard", "/calendar", "/rooms", "/my-bookings"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Only protect exact matches or subpaths
  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("token")?.value;
  console.log(token);
  const isTokenValid = token ? verifyToken(token) : false;
  console.log("Verification result:", isTokenValid);
  if (!token || !isTokenValid) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/calendar", "/rooms/:path*", "/my-bookings"],
};
