import "server-only";
import { cookies } from "next/headers";
import type { SessionUser } from "@/types/api";
export async function getSession(): Promise<SessionUser | null> {
  const raw = (await cookies()).get("user")?.value;
  if (!raw) return null;
  try { return JSON.parse(raw) as SessionUser; } catch { return null; }
}
