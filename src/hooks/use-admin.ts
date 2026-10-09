"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { useClientApi } from "./use-client-api";
import type { DashboardStats, User, Paged } from "@/types/api";

export function useAdminDashboardStats() {
  const client = useClientApi();
  return useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: () => adminApi.dashboardStats(client),
  });
}

export function useAdminUsers(params: Record<string, string | number | undefined> = {}) {
  const client = useClientApi();
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => adminApi.users(client, params),
  });
}

export function useChangeUserRole() {
  const client = useClientApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      adminApi.changeRole(client, userId, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export function useAdminAuditLogs(params: Record<string, string | number | undefined> = {}) {
  const client = useClientApi();
  return useQuery({
    queryKey: ["admin-audit-logs", params],
    queryFn: () => adminApi.auditLogs(client, params),
  });
}

export function useAdminIncidentHistory(params: Record<string, string | number | undefined> = {}) {
  const client = useClientApi();
  return useQuery({
    queryKey: ["admin-incident-history", params],
    queryFn: () => adminApi.incidentHistory(client, params),
  });
}
