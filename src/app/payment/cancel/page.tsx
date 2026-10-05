import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/button";
export const metadata: Metadata = { title: "Payment cancelled" };
export default function Cancel() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-2xl font-extrabold">Payment cancelled</h1>
      <p className="text-slate-600">You were not charged. The trip is still unpaid.</p>
      <LinkButton href="/dashboard">Back to my requests</LinkButton>
    </main>
  );
}
