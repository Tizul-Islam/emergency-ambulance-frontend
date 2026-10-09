import "server-only";
import { cookies } from "next/headers";
import { createClient, request, ApiError, BASE } from "@/lib/api/client";

export { ApiError, BASE };

export async function getServerClient() {
  const token = (await cookies()).get("token")?.value;
  return createClient(BASE, token);
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = (await cookies()).get("token")?.value;
  let res: Response;
  try {
    res = await fetch(BASE + path, {
      ...init,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
    });
  } catch (error) {
    console.error("Server API fetch failed:", error);
    throw new ApiError(503, "Backend server is unreachable. Please make sure the API is running.");
  }

  const body = (await res.json().catch(() => null)) as {
    message?: string;
    data?: T;
  } | null;
  if (!res.ok) {
    const msg =
      res.status === 429
        ? "Too many requests. Please wait a moment."
        : (body?.message ?? "Something went wrong. Try again.");
    throw new ApiError(res.status, msg);
  }
  return body?.data as T;
}

export async function serverRequest<T>(
  method: string,
  path: string,
  data?: unknown,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const client = await getServerClient();
  return request<T>(client, method, path, data, params);
}
