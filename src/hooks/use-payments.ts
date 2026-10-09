"use client";

import { useMutation } from "@tanstack/react-query";
import { paymentApi } from "@/lib/api/payment";
import { useClientApi } from "./use-client-api";

export function useCreatePayment() {
  const client = useClientApi();
  return useMutation({
    mutationFn: (tripId: string) => paymentApi.initiate(client, tripId),
  });
}
