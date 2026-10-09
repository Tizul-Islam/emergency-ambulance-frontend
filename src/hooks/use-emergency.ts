"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { emergencyApi } from "@/lib/api/emergency";
import { useClientApi } from "./use-client-api";

export function useEmergency(id: string) {
  const client = useClientApi();
  return useQuery({
    queryKey: ["emergency", id],
    queryFn: () => emergencyApi.byId(client, id),
    enabled: !!id,
  });
}

export function useCreateEmergency() {
  const client = useClientApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: unknown) => emergencyApi.create(client, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emergencies"] });
      qc.invalidateQueries({ queryKey: ["my-emergencies"] });
    },
  });
}

export function useAutoDispatch() {
  const client = useClientApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => emergencyApi.assign(client, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emergencies"] });
      qc.invalidateQueries({ queryKey: ["dispatches"] });
    },
  });
}

export function useManualDispatch() {
  const client = useClientApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ambulanceId }: { id: string; ambulanceId: string }) =>
      emergencyApi.assign(client, id, ambulanceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["emergencies"] });
      qc.invalidateQueries({ queryKey: ["dispatches"] });
    },
  });
}
