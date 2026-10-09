import type { AxiosInstance } from "axios";
import type { User } from "@/types/api";
import { request } from "./client";

export const userApi = {
  me: (client: AxiosInstance) => request<User>(client, "GET", "/users/me"),
  updateMe: (client: AxiosInstance, body: { name?: string; phone?: string }) =>
    request<User>(client, "PATCH", "/users/me", body),
};
