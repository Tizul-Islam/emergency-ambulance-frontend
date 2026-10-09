"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dispatchApi } from "@/lib/api/dispatch";
import { useClientApi } from "./use-client-api";
import type { Dispatch, Paged } from "@/types/api";

export function useDispatches(params: Record<string, string | number | undefined> = {}) {
  const client = useClientApi();
  return useQuery({
    queryKey: ["dispatches", params],
    queryFn: () => dispatchApi.search(client, params),
  });
}

export function useSearchDispatches(query: string) {
  const client = useClientApi();
  return useQuery({
    queryKey: ["dispatches-search", query],
    queryFn: () => dispatchApi.search(client, { q: query }),
    enabled: !!query,
  });
}

export function useDispatch(id: string) {
  const client = useClientApi();
  return useQuery({
    queryKey: ["dispatch", id],
    queryFn: () => dispatchApi.byId(client, id),
    enabled: !!id,
  });
}

export function useMyAssignedDispatches() {
  const client = useClientApi();
  return useQuery({
    queryKey: ["my-assigned-dispatches"],
    queryFn: () => dispatchApi.myAssigned(client),
  });
}

export function useUpdateDispatchStatus() {
  const client = useClientApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      dispatchApi.updateStatus(client, id, status),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["dispatches"] });
      qc.invalidateQueries({ queryKey: ["dispatch", id] });
      qc.invalidateQueries({ queryKey: ["emergencies"] });
      qc.invalidateQueries({ queryKey: ["my-assigned-dispatches"] });
    },
  });
}

export function useSelectHospital() {
  const client = useClientApi();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, hospitalId }: { id: string; hospitalId: string }) =>
      dispatchApi.selectHospital(client, id, hospitalId),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["dispatches"] });
      qc.invalidateQueries({ queryKey: ["dispatch", id] });
      qc.invalidateQueries({ queryKey: ["emergencies"] });
    },
  });
}
