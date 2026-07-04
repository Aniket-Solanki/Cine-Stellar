// Next.js Middleware to handle routing rules, auth checks, and redirects.
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "cinestellar_session";

// Routes that require authentication
const protectedRoutes = ["/watch", "/profile", "/admin"];

// Routes that are only for non-authenticated users
const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  // 1. Check if user is logged in
  let user: { userId: string; email: string; role: string; exp: number } | null = null;

  if (token) {
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        // Base64Url decode the payload (part index 1)
        const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const decoded = JSON.parse(atob(payloadBase64));
        
        // Check expiration
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp > currentTime) {
          user = decoded;
        }
      }
    } catch (e) {
      console.error("Middleware token parse failed", e);
    }
  }

  // If user is trying to access auth pages (login/signup) but is logged in:
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // If user is trying to access protected pages but is NOT logged in:
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      
      const response = NextResponse.redirect(loginUrl);
      // Clean up invalid/expired cookie
      if (token) {
        response.cookies.delete(COOKIE_NAME);
      }
      return response;
    }

    // Role check for Admin pages
    if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (except auth endpoints if needed)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
