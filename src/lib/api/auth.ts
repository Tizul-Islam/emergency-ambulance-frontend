import type { LoginData } from "@/types/api";
import { createClient, request } from "./client";

export async function login(payload: { email: string; password: string }) {
  const client = createClient(
    process.env.NEXT_PUBLIC_API_BASE_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:5000/api/v1",
  );
  return request<LoginData>(client, "POST", "/auth/login", payload);
}

export async function register(payload: {
  name: string;
  email: string;
  password: string;
  phone: string;
}) {
  const client = createClient(
    process.env.NEXT_PUBLIC_API_BASE_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:5000/api/v1",
  );
  return request<{ id: string }>(client, "POST", "/auth/register", payload);
}
