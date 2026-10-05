import "server-only";
import { cookies } from "next/headers";
export class ApiError extends Error { constructor(public status: number, message: string) { super(message); } }
export const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(BASE + path, {
    ...init, cache: "no-store",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
  });
  const body = (await res.json().catch(() => null)) as { message?: string; data?: T } | null;
  if (!res.ok) throw new ApiError(res.status, body?.message ?? "Something went wrong. Try again.");
  return body?.data as T;
}
