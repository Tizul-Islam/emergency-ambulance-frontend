import type { AxiosInstance } from "axios";
import type { Notification, Paged } from "@/types/api";
import { request } from "./client";

export const notificationApi = {
  my: (client: AxiosInstance, params: Record<string, string | number | undefined>) =>
    request<Paged<Notification>>(client, "GET", "/notifications/my", undefined, params),
  markRead: (client: AxiosInstance, id: string) =>
    request<unknown>(client, "PATCH", `/notifications/${id}/read`),
};
