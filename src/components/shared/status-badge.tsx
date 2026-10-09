import { Badge } from "@/components/ui/badge";
import { label } from "@/lib/utils";
import type { Priority, RequestStatus } from "@/types/api";
const P: Record<Priority, string> = { CRITICAL: "bg-red-600 text-white", HIGH: "bg-amber-600 text-white", MEDIUM: "bg-blue-600 text-white", LOW: "bg-slate-200 text-slate-800" };
export const PriorityBadge = ({ priority }: { priority: Priority }) => <Badge className={P[priority]}>{label(priority)}</Badge>;
export function StatusBadge({ status }: { status: RequestStatus | string }) {
  const cls = status === "COMPLETED" ? "bg-green-100 text-green-800" : status === "CANCELLED" || status === "FAILED" ? "bg-slate-200 text-slate-700" : "bg-amber-100 text-amber-800";
  return <Badge className={cls}>{label(status)}</Badge>;
}

export function PaymentBadge({ status, fare }: { status?: string, fare?: number | null }) {
  if (fare == null) return null;
  const isPaid = status === "SUCCESS";
  const cls = isPaid ? "bg-green-600 text-white" : "bg-red-500 text-white";
  return <Badge className={cls}>{isPaid ? "PAID" : "UNPAID"}</Badge>;
}
