import type { Metadata } from "next";
import { api, ApiError } from "@/lib/api";
import { LinkButton } from "@/components/ui/button";
export const metadata: Metadata = { title: "Payment received" };
export default async function Success({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  let ok = false; let msg = "We could not confirm this payment.";
  if (session_id) {
    try { const p = await api<{ status: string }>(`/payments/verify?session_id=${encodeURIComponent(session_id)}`); ok = p.status === "SUCCESS"; if (!ok) msg = "Your payment is still processing. Refresh in a moment."; }
    catch (e) { if (e instanceof ApiError) msg = e.message; }
  }
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-2xl font-extrabold">{ok ? "Payment received" : "Payment not confirmed"}</h1>
      <p className="text-slate-600">{ok ? "Thank you. Your trip is paid and a receipt is in your notifications." : msg}</p>
      <LinkButton href="/dashboard">Back to my requests</LinkButton>
    </main>
  );
}
