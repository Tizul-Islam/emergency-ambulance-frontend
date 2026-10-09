import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import { getSession } from "@/lib/session";
import { when } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterChips, Pagination } from "@/components/shared/url-controls";
import { PriorityBadge, StatusBadge, PaymentBadge } from "@/components/shared/status-badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ActionButton } from "@/components/features/action-button";
import { AutoRefresh } from "@/components/features/auto-refresh";
import { assignAction } from "@/actions/requests";
import type { EmergencyRequest, Paged } from "@/types/api";

export const metadata: Metadata = { title: "Emergencies" };

const DONE = ["COMPLETED", "CANCELLED", "FAILED"];

export default async function EmergenciesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    status?: string;
    priority?: string;
    search?: string;
  }>;
}) {
  const user = await getSession();
  if (!user) return null;
  const sp = await searchParams;

  let rows: EmergencyRequest[] = [];
  let meta = { page: 1, limit: 10, total: 0, totalPages: 1 };
  let queue: EmergencyRequest[] = [];

  if (user.role === "PATIENT") {
    const res = await api<Paged<EmergencyRequest>>(
      `/requests/my?page=${sp.page ?? 1}&limit=10`,
    );
    rows = res.data.filter((r) =>
      sp.status === "active"
        ? !DONE.includes(r.status)
        : sp.status === "done"
          ? DONE.includes(r.status)
          : true,
    );
    meta = res.meta;
  } else {
    if (user.role === "DISPATCHER") {
      queue = await api<EmergencyRequest[]>("/requests/queue").catch(() => []);
    }
    const q = new URLSearchParams({
      page: sp.page ?? "1",
      limit: "10",
      ...(sp.priority ? { priority: sp.priority } : {}),
      ...(sp.search ? { q: sp.search } : {}),
    });
    const res = await api<Paged<EmergencyRequest>>(`/requests?${q}`);
    rows = res.data;
    meta = res.meta;
  }

  return (
    <div className="space-y-4">
      <AutoRefresh every={15000} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-extrabold">Emergencies</h2>
        {user.role === "PATIENT" && (
          <LinkButton href="/emergencies/create" variant="destructive">
            Create Emergency
          </LinkButton>
        )}
      </div>

      {user.role === "DISPATCHER" && queue.length > 0 && (
        <Card className="space-y-3 border-red-200 bg-red-50/50">
          <h3 className="font-bold text-red-800">Priority queue</h3>
          {queue.map((r) => (
            <div
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-2"
            >
              <div>
                <Link
                  href={`/emergencies/${r.id}`}
                  className="font-semibold underline"
                >
                  {r.description}
                </Link>
                <p className="text-sm text-slate-600">
                  {r.pickupAddress} · {r.patient?.name}
                </p>
              </div>
              <span className="flex items-center gap-2">
                <PriorityBadge priority={r.priority} />
                <LinkButton 
                  href={`/emergencies/${r.id}/assign`} 
                  variant="outline" 
                  size="sm"
                >
                  Manual Assign
                </LinkButton>
                <ActionButton
                  action={assignAction.bind(null, r.id)}
                  success="Ambulance assigned"
                >
                  Auto dispatch
                </ActionButton>
              </span>
            </div>
          ))}
        </Card>
      )}

      <FilterChips
        base="/emergencies"
        param="status"
        current={sp.status}
        params={sp}
        options={[
          { value: "", label: "All" },
          { value: "active", label: "Active" },
          { value: "done", label: "Finished" },
        ]}
      />

      {rows.length === 0 ? (
        <EmptyState
          title="No emergencies found"
          hint="Adjust filters or create a new emergency request."
        />
      ) : (
        <div className="grid gap-3">
          {rows.map((r) => (
            <Card
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-2"
            >
              <div>
                <Link
                  className="font-bold underline"
                  href={`/emergencies/${r.id}`}
                >
                  {r.description}
                </Link>
                <p className="text-sm text-slate-500">
                  {r.pickupAddress} · {when(r.createdAt)}
                </p>
              </div>
              <span className="flex gap-2">
                <PriorityBadge priority={r.priority} />
                <StatusBadge status={r.status} />
                {r.trips?.[0] && <PaymentBadge status={r.trips[0].payment?.status} fare={r.trips[0].fare} />}
              </span>
            </Card>
          ))}
        </div>
      )}
      <Pagination base="/emergencies" meta={meta} params={sp} />
    </div>
  );
}
