"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { login as loginApi } from "@/lib/api/auth";
import { HOME } from "@/lib/constants/nav";
import { DEMO_CREDENTIALS } from "@/lib/constants/demo-credentials";
import type { ActionResult, Role } from "@/types/api";
import type { LoginInput, RegisterInput } from "@/schemas";
import { BASE } from "@/lib/api/client";

async function post(path: string, payload: unknown) {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const body = (await res.json().catch(() => null)) as {
    message?: string;
    data?: unknown;
  } | null;
  return {
    ok: res.ok,
    message: body?.message ?? "Request failed",
    data: body?.data,
  };
}

async function setSession(d: {
  accessToken: string;
  user: { role: Role };
}) {
  const jar = await cookies();
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
  jar.set("token", d.accessToken, opts);
  jar.set("user", JSON.stringify(d.user), opts);
}

export async function loginAction(input: LoginInput): Promise<ActionResult> {
  try {
    const d = await loginApi(input);
    await setSession(d);
    return { redirectTo: HOME };
  } catch (e) {
    return {
      error:
        e instanceof Error
          ? e.message
          : "Cannot reach the server. Check your connection and try again.",
    };
  }
}

export const demoLoginAction = async (role: Role) =>
  loginAction({
    email: DEMO_CREDENTIALS[role].email,
    password: DEMO_CREDENTIALS[role].password,
  });

export async function registerAction(
  input: RegisterInput,
): Promise<ActionResult> {
  try {
    const r = await post("/auth/register", input);
    if (!r.ok) return { error: r.message };
    return loginAction({ email: input.email, password: input.password });
  } catch {
    return {
      error: "Cannot reach the server. Check your connection and try again.",
    };
  }
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete("token");
  jar.delete("user");
  redirect("/login");
}
