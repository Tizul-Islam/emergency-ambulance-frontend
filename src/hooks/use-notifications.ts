"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "@/lib/api/notification";
import { useClientApi } from "./use-client-api";
import type { Notification, Paged } from "@/types/api";

export function useMyNotifications(params: Record<string, string | number | undefined> = {}) {
  const client = useClientApi();
  return useQuery({
    queryKey: ["my-notifications", params],
    queryFn: () => notificationApi.my(client, params),
  });
}

export function useMarkNotificationRead() {
  const client = useClientApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationApi.markRead(client, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-notifications"] });
    },
  });
}
