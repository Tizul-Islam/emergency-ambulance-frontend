"use client";
import { useState } from "react";
import { ActionButton } from "./action-button";
import { updateStatusAction } from "@/actions/requests";
import { REQUEST_FLOW } from "@/types/api";
import { label } from "@/lib/utils";
export function StatusControl({ dispatchId, current }: { dispatchId: string; current: string }) {
  const [status, setStatus] = useState(current);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor="st" className="text-sm font-semibold">Update status</label>
      <select id="st" value={status} onChange={(e) => setStatus(e.target.value)} className="h-8 rounded-md border border-slate-300 bg-white px-2 text-sm">
        {[...REQUEST_FLOW.slice(2), "CANCELLED", "FAILED"].map((s) => <option key={s} value={s}>{label(s)}</option>)}
      </select>
      <ActionButton action={() => updateStatusAction(dispatchId, status)} success="Status updated">Save status</ActionButton>
    </div>
  );
}
