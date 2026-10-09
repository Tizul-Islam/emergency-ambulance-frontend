"use client";

import { ErrorState } from "@/components/shared/error-state";

export default function AmbulanceError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ErrorState title="Could not load ambulance" message={error.message} retry={reset} />;
}
