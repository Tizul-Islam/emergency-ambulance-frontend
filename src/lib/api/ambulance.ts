import type { AxiosInstance } from "axios";
import type { Ambulance, Paged } from "@/types/api";
import { request } from "./client";

export const ambulanceApi = {
  list: (client: AxiosInstance, params: Record<string, string | number | undefined>) =>
    request<Paged<Ambulance>>(client, "GET", "/ambulances", undefined, params),
  available: (client: AxiosInstance) =>
    request<Ambulance[]>(client, "GET", "/ambulances/available"),
  search: (client: AxiosInstance, query: string) =>
    request<Ambulance[]>(client, "GET", "/ambulances/search", undefined, { q: query }),
  byId: (client: AxiosInstance, id: string) =>
    request<Ambulance>(client, "GET", `/ambulances/${id}`),
  nearest: (client: AxiosInstance, lat: number, lng: number) =>
    request<Ambulance>(client, "GET", "/ambulances/nearest", undefined, { lat, lng }),
  create: (client: AxiosInstance, body: unknown) =>
    request<Ambulance>(client, "POST", "/ambulances", body),
  update: (client: AxiosInstance, id: string, body: unknown) =>
    request<Ambulance>(client, "PATCH", `/ambulances/${id}`, body),
  delete: (client: AxiosInstance, id: string) =>
    request<unknown>(client, "DELETE", `/ambulances/${id}`),
};
