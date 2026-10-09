import type { AxiosInstance } from "axios";
import type { DashboardStats, Paged, User } from "@/types/api";
import { request } from "./client";

export const adminApi = {
  dashboardStats: (client: AxiosInstance) =>
    request<DashboardStats>(client, "GET", "/admin/dashboard-stats"),
  users: (client: AxiosInstance, params: Record<string, string | number | undefined>) =>
    request<Paged<User>>(client, "GET", "/admin/users", undefined, params),
  searchUsers: (client: AxiosInstance, query: string) =>
    request<Paged<User>>(client, "GET", "/admin/users/search", undefined, { q: query }),
  changeRole: (client: AxiosInstance, userId: string, role: string) =>
    request<User>(client, "PATCH", `/admin/users/${userId}/role`, { role }),
  auditLogs: (client: AxiosInstance, params: Record<string, string | number | undefined>) =>
    request<Paged<unknown>>(client, "GET", "/admin/audit-logs", undefined, params),
  incidentHistory: (client: AxiosInstance, params: Record<string, string | number | undefined>) =>
    request<Paged<unknown>>(client, "GET", "/admin/incident-history", undefined, params),
};
