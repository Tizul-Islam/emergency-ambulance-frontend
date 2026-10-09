"use client";

import { ErrorState } from "@/components/shared/error-state";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Dashboard error"
      message={error.message}
      retry={reset}
    />
  );
}
