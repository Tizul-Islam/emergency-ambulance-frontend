import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import { when } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { PriorityBadge } from "@/components/shared/status-badge";
import { ActionButton } from "@/components/features/action-button";
import { AutoRefresh } from "@/components/features/auto-refresh";
import { Card } from "@/components/ui/card";
import { assignAction } from "@/actions/requests";
import type { EmergencyRequest } from "@/types/api";
export const metadata: Metadata = { title: "Dispatch queue" };
export default async function Queue() {
  const queue = await api<EmergencyRequest[]>("/requests/queue");
  return (
    <div className="space-y-4">
      <AutoRefresh every={10000} />
      <h1 className="text-2xl font-extrabold">Pending queue</h1>
      {queue.length === 0 ? <EmptyState title="No pending requests" hint="New emergencies appear here, most urgent first." /> : queue.map((r) => (
        <Card key={r.id} className="flex flex-wrap items-center justify-between gap-3">
          <div><Link className="font-bold underline" href={`/dispatcher/requests/${r.id}`}>{r.description}</Link><p className="text-sm text-slate-500">{r.pickupAddress}. {r.patient?.name}, {r.patient?.phone}. {when(r.createdAt)}</p></div>
          <span className="flex items-center gap-2"><PriorityBadge priority={r.priority} /><ActionButton action={assignAction.bind(null, r.id)} success="Nearest ambulance assigned">Assign nearest ambulance</ActionButton></span>
        </Card>))}
    </div>
  );
}
