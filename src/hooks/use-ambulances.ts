"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ambulanceApi } from "@/lib/api/ambulance";
import { useClientApi } from "./use-client-api";
import type { Ambulance, Paged } from "@/types/api";

export function useAmbulances(params: Record<string, string | number | undefined> = {}) {
  const client = useClientApi();
  return useQuery({
    queryKey: ["ambulances", params],
    queryFn: () => client.get<Paged<Ambulance>>("/ambulances", { params }).then(res => res.data),
  });
}

export function useAvailableAmbulances() {
  const client = useClientApi();
  return useQuery({
    queryKey: ["available-ambulances"],
    queryFn: () => client.get<Ambulance[]>("/ambulances/available").then(res => res.data),
  });
}

export function useAmbulance(id: string) {
  const client = useClientApi();
  return useQuery({
    queryKey: ["ambulance", id],
    queryFn: () => ambulanceApi.byId(client, id),
    enabled: !!id,
  });
}

export function useSearchAmbulances(query: string) {
  const client = useClientApi();
  return useQuery({
    queryKey: ["ambulances-search", query],
    queryFn: () => client.get<Ambulance[]>(`/ambulances/search?q=${encodeURIComponent(query)}`).then(res => res.data),
    enabled: !!query,
  });
}

export function useNearestAmbulance(lat: number, lng: number) {
  const client = useClientApi();
  return useQuery({
    queryKey: ["nearest-ambulance", lat, lng],
    queryFn: () => client.get<Ambulance>(`/ambulances/nearest?lat=${lat}&lng=${lng}`).then(res => res.data),
    enabled: !!lat && !!lng,
  });
}

export function useCreateAmbulance() {
  const client = useClientApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: unknown) =>
      ambulanceApi.create(client, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ambulances"] });
      qc.invalidateQueries({ queryKey: ["available-ambulances"] });
    },
  });
}

export function useUpdateAmbulance() {
  const client = useClientApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: unknown }) =>
      ambulanceApi.update(client, id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["ambulances"] });
      qc.invalidateQueries({ queryKey: ["ambulance", id] });
      qc.invalidateQueries({ queryKey: ["available-ambulances"] });
    },
  });
}

export function useDeleteAmbulance() {
  const client = useClientApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      ambulanceApi.delete(client, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ambulances"] });
      qc.invalidateQueries({ queryKey: ["available-ambulances"] });
    },
  });
}
