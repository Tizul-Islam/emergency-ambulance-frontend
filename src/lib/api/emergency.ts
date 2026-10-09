import type { AxiosInstance } from "axios";
import type { EmergencyRequest, Paged } from "@/types/api";
import { request } from "./client";

export const emergencyApi = {
  my: (client: AxiosInstance, params: Record<string, string | number | undefined>) =>
    request<Paged<EmergencyRequest>>(client, "GET", "/requests/my", undefined, params),
  all: (client: AxiosInstance, params: Record<string, string | number | undefined>) =>
    request<Paged<EmergencyRequest>>(client, "GET", "/requests", undefined, params),
  search: (client: AxiosInstance, query: string) =>
    request<EmergencyRequest[]>(client, "GET", "/requests/search", undefined, { q: query }),
  queue: (client: AxiosInstance) =>
    request<EmergencyRequest[]>(client, "GET", "/requests/queue"),
  byId: (client: AxiosInstance, id: string) =>
    request<EmergencyRequest>(client, "GET", `/requests/${id}`),
  create: (client: AxiosInstance, body: unknown) =>
    request<EmergencyRequest>(client, "POST", "/requests", body),
  cancel: (client: AxiosInstance, id: string) =>
    request<unknown>(client, "PATCH", `/requests/${id}/cancel`),
  assign: (client: AxiosInstance, id: string, ambulanceId?: string) =>
    request<unknown>(client, "POST", `/requests/${id}/assign`, ambulanceId ? { ambulanceId } : {}),
};
