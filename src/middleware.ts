import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { HOME } from "@/lib/constants/nav";
import {
  canAccess,
  isProtected,
} from "@/lib/auth/permissions";
import type { Role } from "@/types/api";

const LEGACY_REDIRECTS: [string, string][] = [
  ["/dashboard/new-request", "/emergencies/create"],
  ["/dispatcher", "/emergencies"],
  ["/dispatcher/requests", "/emergencies"],
  ["/dispatcher/ambulances", "/ambulances"],
  ["/dispatcher/hospitals", "/hospitals"],
  ["/admin", "/analytics"],
  ["/payment/success", "/payments/success"],
  ["/payment/cancel", "/payments/cancel"],
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  for (const [from, to] of LEGACY_REDIRECTS) {
    if (pathname === from || pathname.startsWith(`${from}/`)) {
      const rest = pathname.slice(from.length);
      if (from === "/dashboard/requests" && rest.startsWith("/")) {
        return NextResponse.redirect(new URL(`/emergencies${rest}`, req.url));
      }
      if (from === "/dispatcher/requests" && rest.startsWith("/")) {
        return NextResponse.redirect(new URL(`/emergencies${rest}`, req.url));
      }
      if (pathname === from) {
        return NextResponse.redirect(new URL(to, req.url));
      }
    }
  }
  if (pathname.startsWith("/dashboard/requests/")) {
    const id = pathname.split("/").pop();
    return NextResponse.redirect(new URL(`/emergencies/${id}`, req.url));
  }
  if (pathname.startsWith("/dispatcher/requests/")) {
    const id = pathname.split("/").pop();
    return NextResponse.redirect(new URL(`/emergencies/${id}`, req.url));
  }

  let role: Role | null = null;
  const token = req.cookies.get("token")?.value;
  if (token) {
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_ACCESS_SECRET || ""),
      );
      role = payload.role as Role;
    } catch {
      role = null;
    }
  }

  if (pathname === "/login" || pathname === "/register") {
    return role
      ? NextResponse.redirect(new URL(HOME, req.url))
      : NextResponse.next();
  }

  if (!isProtected(pathname)) return NextResponse.next();

  if (!role) {
    const url = new URL("/login", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (!canAccess(pathname, role)) {
    return NextResponse.redirect(new URL(HOME, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/dashboard/:path*",
    "/emergencies/:path*",
    "/ambulances/:path*",
    "/dispatches/:path*",
    "/hospitals/:path*",
    "/trips/:path*",
    "/payments/:path*",
    "/notifications/:path*",
    "/analytics/:path*",
    "/profile/:path*",
    "/dispatcher/:path*",
    "/admin/:path*",
    "/payment/:path*",
  ],
};
