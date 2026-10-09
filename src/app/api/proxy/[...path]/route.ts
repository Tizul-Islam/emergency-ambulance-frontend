import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { BASE } from "@/lib/api/client";

async function proxy(req: NextRequest, path: string[]) {
  const token = (await cookies()).get("token")?.value;
  const target = `${BASE}/${path.join("/")}${req.nextUrl.search}`;
  try {
    const res = await fetch(target, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body:
        req.method !== "GET" && req.method !== "HEAD"
          ? await req.text()
          : undefined,
      cache: "no-store",
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Proxy fetch failed:", error);
    return NextResponse.json(
      { message: "Backend server is unreachable. Please make sure the API is running." },
      { status: 503 }
    );
  }
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxy(req, (await ctx.params).path);
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxy(req, (await ctx.params).path);
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxy(req, (await ctx.params).path);
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return proxy(req, (await ctx.params).path);
}
