import type { AxiosInstance } from "axios";
import type { Hospital, Paged } from "@/types/api";
import { request } from "./client";

export const hospitalApi = {
  list: (client: AxiosInstance, params: Record<string, string | number | undefined>) =>
    request<Paged<Hospital>>(client, "GET", "/hospitals", undefined, params),
  search: (client: AxiosInstance, query: string) =>
    request<Hospital[]>(client, "GET", "/hospitals/search", undefined, { q: query }),
  byId: (client: AxiosInstance, id: string) =>
    request<Hospital>(client, "GET", `/hospitals/${id}`),
  create: (client: AxiosInstance, body: unknown) =>
    request<Hospital>(client, "POST", "/hospitals", body),
  update: (client: AxiosInstance, id: string, body: unknown) =>
    request<Hospital>(client, "PATCH", `/hospitals/${id}`, body),
  updateAvailability: (client: AxiosInstance, id: string, emergencyAvailable: boolean) =>
    request<Hospital>(client, "PATCH", `/hospitals/${id}/availability`, { emergencyAvailable }),
  delete: (client: AxiosInstance, id: string) =>
    request<unknown>(client, "DELETE", `/hospitals/${id}`),
};
