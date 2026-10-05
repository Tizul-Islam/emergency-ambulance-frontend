"use client";
import { Button } from "@/components/ui/button";
export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-3 p-6 text-center" role="alert">
      <h1 className="text-2xl font-extrabold">Something went wrong</h1>
      <p className="text-slate-600">{error.message || "An unexpected error occurred."}</p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
