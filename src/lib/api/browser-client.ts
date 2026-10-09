"use client";

import { createClient } from "./client";

export function getBrowserClient() {
  return createClient("/api/proxy");
}
