import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = { title: "Payment Cancelled" };

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-2xl font-extrabold">Payment Cancelled</h1>
      <p className="text-slate-600">
        Your Stripe checkout was cancelled. You can try again when ready.
      </p>
      <LinkButton href="/payments">Return to payments</LinkButton>
    </main>
  );
}
