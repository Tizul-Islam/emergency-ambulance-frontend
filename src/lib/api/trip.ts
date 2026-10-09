import type { AxiosInstance } from "axios";
import type { Paged, TripDetail } from "@/types/api";
import { request } from "./client";

export const tripApi = {
  list: (client: AxiosInstance, params: Record<string, string | number | undefined>) =>
    request<Paged<TripDetail>>(client, "GET", "/trips", undefined, params),
  my: (client: AxiosInstance, params: Record<string, string | number | undefined>) =>
    request<Paged<TripDetail>>(client, "GET", "/trips/my", undefined, params),
  byId: (client: AxiosInstance, id: string) =>
    request<TripDetail>(client, "GET", `/trips/${id}`),
};
