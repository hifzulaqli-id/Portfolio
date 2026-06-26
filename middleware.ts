import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "portfolio_admin_session";

// Middleware runs on the Edge runtime and does a lightweight cookie-presence
// check purely to decide redirects (UX). The REAL, tamper-proof session
// verification (signed HMAC) happens server-side in lib/auth.ts — which runs
// on Node.js — inside the admin layout and every /api/admin route. So a spoofed
// cookie can redirect past this layer but still cannot access any protected
// data.

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const hasSession = token === "mock-session-token";
  // Already logged in? Don't show the login page — bounce to dashboard.
  if (pathname === "/admin/login") {
    if (hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Any other /admin route: redirect to login if no session cookie.
  if (pathname.startsWith("/admin") && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
