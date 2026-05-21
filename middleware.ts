import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

export async function middleware(req: NextRequest) {
  let session = false;
  const sessionToken = req.cookies.get("uniprof_token")?.value;

  if (sessionToken) {
    try {
      const payload = jose.decodeJwt(sessionToken);
      const currentDate = new Date().getTime();
      session = payload.exp ? (payload.exp * 1000) > currentDate : true;
    } catch (e) {
      session = false;
    }
  }

  const { pathname } = req.nextUrl;

  if (
    (pathname.startsWith("/checkout") || pathname.startsWith("/user")) &&
    !session
  ) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname === "/login" || pathname === "/verify-otp") && session) {
    const redirectUrl = req.nextUrl.searchParams.get("redirect") || "/mentores";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  return NextResponse.next();
}

// Configuração do middleware
export const config = {
  matcher: ["/checkout/:path*", "/user/:path*", "/login", "/verify-otp"],
};
