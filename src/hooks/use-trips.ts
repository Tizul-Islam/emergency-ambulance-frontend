"use client";

import { useQuery } from "@tanstack/react-query";
import { useClientApi } from "./use-client-api";
import { tripApi } from "@/lib/api/trip";
import type { Trip, TripDetail, Paged } from "@/types/api";

export function useTrips(params: Record<string, string | number | undefined> = {}) {
  const client = useClientApi();
  return useQuery({
    queryKey: ["trips", params],
    queryFn: () => tripApi.list(client, params),
  });
}

export function useTrip(id: string) {
  const client = useClientApi();
  return useQuery({
    queryKey: ["trip", id],
    queryFn: () => tripApi.byId(client, id),
    enabled: !!id,
  });
}

export function useMyTrips(params: Record<string, string | number | undefined> = {}) {
  const client = useClientApi();
  return useQuery({
    queryKey: ["my-trips", params],
    queryFn: () => tripApi.my(client, params),
  });
}
