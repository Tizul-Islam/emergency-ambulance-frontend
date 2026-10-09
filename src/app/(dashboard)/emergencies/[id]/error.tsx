"use client";

import { ErrorState } from "@/components/shared/error-state";

export default function EmergencyError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Could not load emergency"
      message={error.message}
      retry={reset}
    />
  );
}
