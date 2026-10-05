import { Card } from "@/components/ui/card";
import { DispatchLine } from "@/components/shared/dispatch-line";
import { PriorityBadge, StatusBadge } from "@/components/shared/status-badge";
import { ActionButton } from "./action-button";
import { StatusControl } from "./status-control";
import { AutoRefresh } from "./auto-refresh";
import { assignAction, cancelRequestAction, payAction } from "@/actions/requests";
import { when } from "@/lib/utils";
import type { EmergencyRequest, Role } from "@/types/api";
export function RequestDetail({ request: r, role }: { request: EmergencyRequest; role: Role }) {
  const d = r.dispatches?.[0];
  const trip = d?.trips?.[0];
  const active = !["COMPLETED", "CANCELLED", "FAILED"].includes(r.status);
  return (
    <div className="space-y-4">
      {active && <AutoRefresh />}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-lg font-bold">{r.description}</h2><span className="flex gap-2"><PriorityBadge priority={r.priority} /><StatusBadge status={r.status} /></span></div>
        <p className="mt-1 text-sm text-slate-500">{r.pickupAddress}. Requested {when(r.createdAt)}</p>
        {r.patient && <p className="text-sm">Patient: {r.patient.name}, {r.patient.phone}</p>}
        {!["CANCELLED", "FAILED"].includes(r.status) && <div className="mt-4"><DispatchLine status={r.status} /></div>}
      </Card>
      {d && <Card><h3 className="font-bold">Ambulance</h3><p className="text-sm">{d.ambulance.registrationNumber} ({d.ambulance.type.toLowerCase()}){d.driver ? `, driver ${d.driver.name}, ${d.driver.phone}` : ""}</p></Card>}
      <div className="flex flex-wrap items-center gap-3">
        {role === "PATIENT" && ["REQUESTED", "PRIORITY_ASSIGNED"].includes(r.status) && <ActionButton variant="destructive" action={cancelRequestAction.bind(null, r.id)} success="Request cancelled">Cancel request</ActionButton>}
        {role === "PATIENT" && r.status === "COMPLETED" && trip?.fare != null && <ActionButton size="default" action={payAction.bind(null, trip.id)}>{`Pay BDT ${trip.fare} with card`}</ActionButton>}
        {role !== "PATIENT" && !d && ["REQUESTED", "PRIORITY_ASSIGNED"].includes(r.status) && <ActionButton action={assignAction.bind(null, r.id)} success="Ambulance assigned">Assign ambulance</ActionButton>}
        {role !== "PATIENT" && d && active && <StatusControl dispatchId={d.id} current={r.status} />}
      </div>
    </div>
  );
}
