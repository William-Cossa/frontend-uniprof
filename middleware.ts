import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const PROTECTED_ROUTES = ["/checkout", "/user", "/mentor"];
const AUTH_ROUTES = ["/login", "/verify-otp"];
const JWT_SECRET = process.env.JWT_SECRET;
const encodedSecret = JWT_SECRET ? new TextEncoder().encode(JWT_SECRET) : null;

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  let hasValidSession = false;
  const sessionToken = req.cookies.get("uniprof_token")?.value;

  if (sessionToken && encodedSecret) {
    try {
      await jose.jwtVerify(sessionToken, encodedSecret);
      hasValidSession = true;
    } catch (error) {
      hasValidSession = false;
    }
  }
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => {
    if (route === "/mentor") {
      const parts = pathname.split("/");
      return parts[1] === "mentor" && parts[3] === "agendar";
    }
    return pathname.startsWith(route);
  });

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isProtectedRoute && !hasValidSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);

    // Se o token existir mas for inválido, limpa o cookie corrompido para evitar loops
    const response = NextResponse.redirect(loginUrl);
    if (sessionToken) {
      response.cookies.delete("uniprof_token");
    }
    return response;
  }

  if (isAuthRoute && hasValidSession) {
    const redirectParam = req.nextUrl.searchParams.get("redirect") || "/mentores";
    return NextResponse.redirect(new URL(redirectParam, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};
