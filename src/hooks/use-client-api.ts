"use client";

import { useMemo } from "react";
import { getBrowserClient } from "@/lib/api/browser-client";

export function useClientApi() {
  return useMemo(() => getBrowserClient(), []);
}
