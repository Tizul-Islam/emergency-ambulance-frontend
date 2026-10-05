import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { HOME } from "@/lib/utils";
import type { Role } from "@/types/api";

const RULES: [string, Role[]][] = [["/admin", ["ADMIN"]], ["/dispatcher", ["DISPATCHER", "ADMIN"]], ["/dashboard", ["PATIENT"]]];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  let role: Role | null = null;
  const token = req.cookies.get("token")?.value;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_ACCESS_SECRET));
      role = payload.role as Role;
    } catch { role = null; }
  }
  if (pathname === "/login" || pathname === "/register") {
    return role ? NextResponse.redirect(new URL(HOME[role], req.url)) : NextResponse.next();
  }
  const rule = RULES.find(([p]) => pathname === p || pathname.startsWith(p + "/"));
  if (!rule) return NextResponse.next();
  if (!role) {
    const url = new URL("/login", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
  if (!rule[1].includes(role)) return NextResponse.redirect(new URL(HOME[role], req.url));
  return NextResponse.next();
}
export const config = { matcher: ["/admin/:path*", "/dispatcher/:path*", "/dashboard/:path*", "/login", "/register"] };
