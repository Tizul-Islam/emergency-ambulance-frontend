"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { toast.error(error.message); }, [error]);
  return (
    <div role="alert" className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-6">
      <h2 className="text-lg font-bold">We could not load this page</h2>
      <p className="text-sm text-slate-700">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
