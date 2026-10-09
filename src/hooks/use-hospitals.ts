"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { hospitalApi } from "@/lib/api/hospital";
import { useClientApi } from "./use-client-api";
import type { Hospital, Paged } from "@/types/api";

export function useHospitals(params: Record<string, string | number | undefined> = {}) {
  const client = useClientApi();
  return useQuery({
    queryKey: ["hospitals", params],
    queryFn: () => hospitalApi.list(client, params),
  });
}

export function useHospital(id: string) {
  const client = useClientApi();
  return useQuery({
    queryKey: ["hospital", id],
    queryFn: () => hospitalApi.byId(client, id),
    enabled: !!id,
  });
}

export function useCreateHospital() {
  const client = useClientApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: unknown) =>
      hospitalApi.create(client, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hospitals"] });
    },
  });
}

export function useUpdateHospital() {
  const client = useClientApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: unknown }) =>
      hospitalApi.update(client, id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["hospitals"] });
      qc.invalidateQueries({ queryKey: ["hospital", id] });
    },
  });
}

export function useUpdateHospitalAvailability() {
  const client = useClientApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, emergencyAvailable }: { id: string; emergencyAvailable: boolean }) =>
      hospitalApi.updateAvailability(client, id, emergencyAvailable),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["hospitals"] });
      qc.invalidateQueries({ queryKey: ["hospital", id] });
    },
  });
}

export function useDeleteHospital() {
  const client = useClientApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      hospitalApi.delete(client, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hospitals"] });
    },
  });
}
