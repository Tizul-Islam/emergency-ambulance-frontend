import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import { when } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterChips, Pagination } from "@/components/shared/url-controls";
import { PriorityBadge, StatusBadge } from "@/components/shared/status-badge";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { EmergencyRequest, Paged } from "@/types/api";
export const metadata: Metadata = { title: "My requests" };
const DONE = ["COMPLETED", "CANCELLED", "FAILED"];
export default async function Dashboard({ searchParams }: { searchParams: Promise<{ page?: string; status?: string }> }) {
  const sp = await searchParams;
  const res = await api<Paged<EmergencyRequest>>(`/requests/my?page=${sp.page ?? 1}&limit=10`);
  const rows = res.data.filter((r) => (sp.status === "active" ? !DONE.includes(r.status) : sp.status === "done" ? DONE.includes(r.status) : true));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2"><h1 className="text-2xl font-extrabold">My requests</h1><LinkButton href="/dashboard/new-request">Request ambulance</LinkButton></div>
      <FilterChips base="/dashboard" param="status" current={sp.status} params={sp} options={[{ value: "", label: "All" }, { value: "active", label: "Active" }, { value: "done", label: "Finished" }]} />
      {rows.length === 0 ? <EmptyState title="No requests found" hint="Request an ambulance when you need one. It will appear here." /> : (
        <div className="grid gap-3">{rows.map((r) => (
          <Card key={r.id} className="flex flex-wrap items-center justify-between gap-2">
            <div><Link className="font-bold underline" href={`/dashboard/requests/${r.id}`}>{r.description}</Link><p className="text-sm text-slate-500">{r.pickupAddress}. {when(r.createdAt)}</p></div>
            <span className="flex gap-2"><PriorityBadge priority={r.priority} /><StatusBadge status={r.status} /></span>
          </Card>))}</div>)}
      <Pagination base="/dashboard" meta={res.meta} params={sp} />
    </div>
  );
}
