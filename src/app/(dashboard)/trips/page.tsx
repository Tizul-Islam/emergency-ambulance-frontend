import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import { getSession } from "@/lib/session";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/url-controls";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { when } from "@/lib/utils";
import type { Paged, TripDetail } from "@/types/api";

export const metadata: Metadata = { title: "Trips" };

export default async function TripsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string; order?: string }>;
}) {
  const user = await getSession();
  if (!user) return null;

  const sp = await searchParams;
  const q = new URLSearchParams({
    page: sp.page ?? "1",
    limit: "10",
    ...(sp.sort ? { sort: sp.sort } : {}),
    ...(sp.order ? { order: sp.order } : {}),
  });

  // Patient can now fetch their own trips successfully

  const res = await api<Paged<TripDetail>>(`/trips?${q}`).catch(() => ({
    data: [],
    meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold">{user.role === "PATIENT" ? "My Trips" : "All Trips"}</h2>
      {res.data.length === 0 ? (
        <EmptyState title="No trips found" hint="Trips appear after emergency dispatches are created." />
      ) : (
        <div className="grid gap-3">
          {res.data.map((trip) => (
            <Card key={trip.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
              <div>
                <Link href={`/trips/${trip.id}`} className="font-bold underline">
                  Trip {trip.id.slice(0, 8)}
                </Link>
                <p className="text-sm text-slate-500">
                  {trip.emergencyRequest?.description ?? "Emergency trip"}
                  {trip.createdAt ? ` · ${when(trip.createdAt)}` : ""}
                </p>
                {trip.fare != null && <p className="text-sm">Fare: BDT {trip.fare}</p>}
                {trip.payment && (
                  <p className="text-sm mt-1">
                    <span className="text-slate-500 mr-2">Payment:</span>
                    <span className={trip.payment.status === "SUCCESS" ? "text-green-600 font-semibold" : "text-amber-600 font-semibold"}>
                      {trip.payment.status === "SUCCESS" ? "PAID" : trip.payment.status}
                    </span>
                  </p>
                )}
              </div>
              <StatusBadge status={trip.status} />
            </Card>
          ))}
        </div>
      )}
      <Pagination base="/trips" meta={res.meta} params={sp} />
    </div>
  );
}
