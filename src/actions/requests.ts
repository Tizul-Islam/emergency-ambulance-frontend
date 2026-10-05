"use server";
import { api, ApiError } from "@/lib/api";
import type { ActionResult, EmergencyRequest } from "@/types/api";
import type { RequestInput } from "@/schemas";

async function run(
  fn: () => Promise<ActionResult | void>,
): Promise<ActionResult> {
  try {
    return (await fn()) ?? {};
  } catch (e) {
    return {
      error:
        e instanceof ApiError
          ? e.message
          : "Cannot reach the server. Try again.",
    };
  }
}
const send = (path: string, method: string, body: unknown = {}) =>
  api<unknown>(path, { method, body: JSON.stringify(body) });

export const createRequestAction = (input: RequestInput) =>
  run(async () => {
    const r = await api<EmergencyRequest>("/requests", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return { id: r.id };
  });
export const cancelRequestAction = (id: string) =>
  run(async () => {
    await send(`/requests/${id}/cancel`, "PATCH");
  });
export const assignAction = (id: string) =>
  run(async () => {
    await send(`/requests/${id}/assign`, "POST");
  });
export const updateStatusAction = (dispatchId: string, status: string) =>
  run(async () => {
    await send(`/dispatches/${dispatchId}/status`, "PATCH", { status });
  });
export const payAction = (tripId: string) =>
  run(async () => {
    const r = await api<{ url: string }>("/payments/initiate", {
      method: "POST",
      body: JSON.stringify({ tripId, provider: "STRIPE" }),
    });
    return { url: r.url };
  });
