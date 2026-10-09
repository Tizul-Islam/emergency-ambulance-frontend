"use client";

import { ErrorState } from "@/components/shared/error-state";

export default function LoginError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center p-4">
      <ErrorState title="Login error" message={error.message} retry={reset} />
    </main>
  );
}
