import type { AxiosInstance } from "axios";
import type { Payment, Paged } from "@/types/api";
import { request } from "./client";

export const paymentApi = {
  list: (client: AxiosInstance, params: Record<string, string | number | undefined>) =>
    request<Paged<Payment>>(client, "GET", "/payments", undefined, params),
  byId: (client: AxiosInstance, id: string) =>
    request<Payment>(client, "GET", `/payments/${id}`),
  initiate: (client: AxiosInstance, tripId: string) =>
    request<{ url: string }>(client, "POST", "/payments/initiate", {
      tripId,
      provider: "STRIPE",
    }),
  verify: (client: AxiosInstance, sessionId: string) =>
    request<{ status: string }>(
      client,
      "GET",
      `/payments/verify?session_id=${encodeURIComponent(sessionId)}`,
    ),
};
