import type { AxiosInstance } from "axios";
import type { Dispatch, Paged } from "@/types/api";
import { request } from "./client";

export const dispatchApi = {
  myAssigned: (client: AxiosInstance) =>
    request<Dispatch[]>(client, "GET", "/dispatches/my-assigned"),
  search: (client: AxiosInstance, params: Record<string, string | number | undefined>) =>
    request<Paged<Dispatch>>(client, "GET", "/dispatches/search", undefined, params),
  byId: (client: AxiosInstance, id: string) =>
    request<Dispatch>(client, "GET", `/dispatches/${id}`),
  updateStatus: (client: AxiosInstance, id: string, status: string) =>
    request<unknown>(client, "PATCH", `/dispatches/${id}/status`, { status }),
  selectHospital: (client: AxiosInstance, id: string, hospitalId: string) =>
    request<unknown>(client, "POST", `/dispatches/${id}/select-hospital`, { hospitalId }),
};
