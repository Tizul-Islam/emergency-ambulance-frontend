import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import { getSession } from "@/lib/session";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/url-controls";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActionButton } from "@/components/features/action-button";
import { payAction } from "@/actions/requests";
import type { Paged, TripDetail } from "@/types/api";

export const metadata: Metadata = { title: "Payments" };

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await getSession();
  if (!user) return null;
  const sp = await searchParams;

  const res = await api<Paged<TripDetail>>(
    `/trips?page=${sp.page ?? 1}&limit=10&status=COMPLETED`,
  ).catch(() => ({
    data: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
  }));

  const payable = res.data.filter((t) => t.fare != null && !t.payment);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold">Payments</h2>
      <p className="text-sm text-slate-600">
        Payment records are loaded from completed trips via the real backend API.
      </p>

      {payable.length > 0 && user.role === "PATIENT" && (
        <Card className="space-y-3 border-amber-200 bg-amber-50/50">
          <h3 className="font-bold text-amber-900">Pay now</h3>
          {payable.map((trip) => (
            <div key={trip.id} className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Link href={`/trips/${trip.id}`} className="font-semibold underline">
                  {trip.emergencyRequest?.description ?? `Trip ${trip.id.slice(0, 8)}`}
                </Link>
                <p className="text-sm">BDT {trip.fare}</p>
              </div>
              <ActionButton action={payAction.bind(null, trip.id)}>
                Pay with Stripe
              </ActionButton>
            </div>
          ))}
        </Card>
      )}

      {res.data.length === 0 ? (
        <EmptyState title="No payment records" hint="Completed trips with payments will appear here." />
      ) : (
        <div className="grid gap-3">
          {res.data.map((trip) => (
            <Card key={trip.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
              <div>
                <p className="font-bold">
                  {trip.emergencyRequest?.description ?? `Trip ${trip.id.slice(0, 8)}`}
                </p>
                <p className="text-sm text-slate-500">
                  Fare: BDT {trip.fare ?? "—"}
                  {trip.payment ? ` · Paid BDT ${trip.payment.amount}` : " · Unpaid"}
                </p>
              </div>
              {trip.payment ? (
                <StatusBadge status={trip.payment.status} />
              ) : (
                <span className="text-sm text-amber-700">Pending payment</span>
              )}
            </Card>
          ))}
        </div>
      )}
      <Pagination base="/payments" meta={res.meta} params={sp} />
    </div>
  );
}
