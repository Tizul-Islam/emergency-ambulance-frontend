"use server";
import { api, ApiError } from "@/lib/api";
import type { ActionResult, Driver } from "@/types/api";

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

export const createDriverAction = async (payload: { name: string; phone: string; licenseNumber: string; userId?: string }) => 
  run(async () => {
    await api("/drivers", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  });

export const updateDriverStatusAction = async (id: string, status: string) => 
  run(async () => {
    await api(`/drivers/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  });
