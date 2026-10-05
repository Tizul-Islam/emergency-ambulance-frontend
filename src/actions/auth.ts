"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BASE } from "@/lib/api";
import { HOME } from "@/lib/utils";
import type { ActionResult, LoginData, Role } from "@/types/api";
import type { LoginInput, RegisterInput } from "@/schemas";

const DEMO: Record<Role, string> = { ADMIN: "admin@dispatch.com", DISPATCHER: "dispatcher1@dispatch.com", PATIENT: "patient1@dispatch.com" };

async function post(path: string, payload: unknown) {
  const res = await fetch(BASE + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), cache: "no-store" });
  const body = (await res.json().catch(() => null)) as { message?: string; data?: unknown } | null;
  return { ok: res.ok, message: body?.message ?? "Request failed", data: body?.data };
}

export async function loginAction(input: LoginInput): Promise<ActionResult> {
  try {
    const r = await post("/auth/login", input);
    if (!r.ok) return { error: r.message };
    const d = r.data as LoginData;
    const jar = await cookies();
    const opts = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 7 };
    jar.set("token", d.accessToken, opts);
    jar.set("user", JSON.stringify(d.user), opts);
    return { redirectTo: HOME[d.user.role] };
  } catch {
    return { error: "Cannot reach the server. Check your connection and try again." };
  }
}
export const demoLoginAction = async (role: Role) => loginAction({ email: DEMO[role], password: "Password123!" });

export async function registerAction(input: RegisterInput): Promise<ActionResult> {
  try {
    const r = await post("/auth/register", input);
    if (!r.ok) return { error: r.message };
    return loginAction({ email: input.email, password: input.password });
  } catch {
    return { error: "Cannot reach the server. Check your connection and try again." };
  }
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete("token");
  jar.delete("user");
  redirect("/login");
}
