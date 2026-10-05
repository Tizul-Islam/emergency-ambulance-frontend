import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import { when } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterChips, Pagination } from "@/components/shared/url-controls";
import { PriorityBadge, StatusBadge } from "@/components/shared/status-badge";
import { Card } from "@/components/ui/card";
import type { EmergencyRequest, Paged } from "@/types/api";
export const metadata: Metadata = { title: "All requests" };
const OPTS = [["", "All"], ["REQUESTED", "Requested"], ["AMBULANCE_ASSIGNED", "Assigned"], ["EN_ROUTE", "En route"], ["TO_HOSPITAL", "To hospital"], ["COMPLETED", "Completed"], ["CANCELLED", "Cancelled"]].map(([value, label]) => ({ value, label }));
export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; status?: string }> }) {
  const sp = await searchParams;
  const q = new URLSearchParams({ page: sp.page ?? "1", limit: "10", ...(sp.status ? { status: sp.status } : {}) });
  const res = await api<Paged<EmergencyRequest>>(`/requests?${q}`);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">All requests</h1>
      <FilterChips base="/dispatcher/requests" param="status" current={sp.status} params={sp} options={OPTS} />
      {res.data.length === 0 ? <EmptyState title="No requests found" hint="Try a different status filter." /> : res.data.map((r) => (
        <Card key={r.id} className="flex flex-wrap items-center justify-between gap-2">
          <div><Link className="font-bold underline" href={`/dispatcher/requests/${r.id}`}>{r.description}</Link><p className="text-sm text-slate-500">{r.pickupAddress}. {when(r.createdAt)}</p></div>
          <span className="flex gap-2"><PriorityBadge priority={r.priority} /><StatusBadge status={r.status} /></span>
        </Card>))}
      <Pagination base="/dispatcher/requests" meta={res.meta} params={sp} />
    </div>
  );
}
