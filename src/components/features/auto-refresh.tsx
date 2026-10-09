"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AutoRefresh({ every = 15000 }: { every?: number } = {}) {
  const router = useRouter();

  useEffect(() => {
    // We default to polling every 15 seconds since the backend 
    // does not currently have a Socket.IO server implemented.
    const id = setInterval(() => router.refresh(), every);
    return () => clearInterval(id);
  }, [every, router]);

  return null;
}
