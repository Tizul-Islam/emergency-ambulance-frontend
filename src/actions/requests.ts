"use server";
import { api, ApiError } from "@/lib/api";
import type { ActionResult, EmergencyRequest, Hospital, Driver, Ambulance, Paged } from "@/types/api";
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

export const createRequestAction = async (input: RequestInput) =>
  run(async () => {
    const r = await api<EmergencyRequest>("/requests", {
      method: "POST",
      body: JSON.stringify(input),
    });
    return { id: r.id };
  });
export const cancelRequestAction = async (id: string) =>
  run(async () => {
    await send(`/requests/${id}/cancel`, "PATCH");
  });
export const assignAction = async (id: string) =>
  run(async () => {
    await send(`/requests/${id}/assign`, "POST");
  });
export const updateStatusAction = async (dispatchId: string, status: string, hospitalId?: string) =>
  run(async () => {
    if (status === "TO_HOSPITAL") {
      await send(`/dispatches/${dispatchId}/select-hospital`, "POST", hospitalId ? { hospitalId } : {});
    } else {
      await send(`/dispatches/${dispatchId}/status`, "PATCH", { status });
    }
  });
export const payAction = async (tripId: string) =>
  run(async () => {
    const r = await api<{ url: string }>("/payments/initiate", {
      method: "POST",
      body: JSON.stringify({ tripId, provider: "SSLCOMMERZ" }),
    });
    return { url: r.url };
  });

export const getHospitalsAction = async () => {
  try {
    const res = await api<Paged<Hospital>>("/hospitals?limit=100");
    return res.data;
  } catch {
    return [];
  }
};

export const getAvailableDriversAction = async () => {
  try {
    const res = await api<Paged<Driver> | Driver[]>("/drivers?limit=100");
    const drivers = "data" in res ? res.data : res;
    return drivers.filter(d => !d.ambulanceId);
  } catch {
    return [];
  }
};

export const getAvailableAmbulancesAction = async () => {
  try {
    const res = await api<Paged<Ambulance> | Ambulance[]>("/ambulances?status=AVAILABLE&limit=100");
    return "data" in res ? res.data : res;
  } catch {
    return [];
  }
};

export const manualDispatchAction = async (payload: { requestId: string; ambulanceId: string }) => 
  run(async () => {
    await send(`/requests/${payload.requestId}/assign`, "POST", { ambulanceId: payload.ambulanceId });
  });
