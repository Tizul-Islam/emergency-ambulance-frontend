import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import { getSession } from "@/lib/session";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/url-controls";
import { Card } from "@/components/ui/card";
import { StatusBadge, PriorityBadge } from "@/components/shared/status-badge";
import { when } from "@/lib/utils";
import { ActionButton } from "@/components/features/action-button";
import { updateStatusAction } from "@/actions/requests";
import type { Dispatch } from "@/types/api";

export const metadata: Metadata = { title: "Dispatches" };

export default async function DispatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const sp = await searchParams;
  const user = await getSession();
  
  const q = new URLSearchParams({
    page: sp.page ?? "1",
    limit: "10",
    ...(sp.search ? { q: sp.search } : {}),
  });

  const assigned = user?.role === "DISPATCHER" 
    ? await api<Dispatch[]>("/dispatches/my-assigned").catch(() => [])
    : [];
  const searchResults = await api<Dispatch[]>(`/dispatches/search?q=${encodeURIComponent(sp.search || "")}`).catch(() => []);
    
  const page = Number(sp.page ?? 1);
  const limit = 10;
  const start = (page - 1) * limit;
  const slice = searchResults.slice(start, start + limit);
  const res = {
    data: slice,
    meta: {
      page,
      limit,
      total: searchResults.length,
      totalPages: Math.max(1, Math.ceil(searchResults.length / limit)),
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-extrabold text-slate-900">Dispatches</h2>
        
        <form className="flex gap-2" method="GET">
          <input 
            type="text" 
            name="search" 
            defaultValue={sp.search} 
            placeholder="Search dispatches..."
            className="h-9 rounded-md border border-slate-300 px-3 text-sm" 
          />
          <button type="submit" className="h-9 rounded-md bg-slate-800 px-4 text-sm font-medium text-white hover:bg-slate-700">
            Search
          </button>
        </form>
      </div>

      {assigned.length > 0 && !sp.search && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-slate-800">My Active Dispatches</h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {assigned.map((d) => (
              <Card key={d.id} className="p-5 border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-1">
                    <StatusBadge status={d.emergencyRequest?.status || d.status} />
                    <span className="text-xs text-slate-500 font-medium">Dispatch #{d.id.slice(0,8)}</span>
                  </div>
                  {d.emergencyRequest && (
                    <PriorityBadge priority={d.emergencyRequest.priority} />
                  )}
                </div>
                
                <div className="space-y-2 text-sm text-slate-700 mb-6">
                  {d.emergencyRequest?.patient && (
                    <p><span className="font-semibold text-slate-500">Patient:</span> {d.emergencyRequest.patient.name}</p>
                  )}
                  {d.emergencyRequest?.pickupAddress && (
                    <p><span className="font-semibold text-slate-500">Pickup:</span> {d.emergencyRequest.pickupAddress}</p>
                  )}
                  <p><span className="font-semibold text-slate-500">Ambulance:</span> {d.ambulance.registrationNumber} ({d.ambulance.type})</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <Link href={`/dispatches/${d.id}`} className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                    View Full Details →
                  </Link>
                  
                  {(d.emergencyRequest?.status === "AMBULANCE_ASSIGNED" || d.status === "DISPATCHED") && (
                    <ActionButton 
                      action={() => updateStatusAction(d.id, "DRIVER_ACCEPTED")}
                      success="Dispatch accepted"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Accept Dispatch
                    </ActionButton>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {(sp.search || user?.role !== "PATIENT") && (
        <div className="space-y-4 mt-8">
          <h3 className="font-bold text-lg text-slate-800">
            {sp.search ? "Search Results" : "All Dispatches"}
          </h3>
          
          {res.data.length === 0 ? (
            <EmptyState title="No dispatches found" hint={sp.search ? "Try a different search term." : "Dispatches appear when emergencies are assigned."} />
          ) : (
            <div className="grid gap-3">
              {res.data.map((d) => (
                <Card key={d.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:shadow-sm transition-shadow">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Link href={`/dispatches/${d.id}`} className="font-bold text-blue-600 hover:underline">
                        #{d.id.slice(0, 8)} - {d.ambulance.registrationNumber}
                      </Link>
                      {d.emergencyRequest && <PriorityBadge priority={d.emergencyRequest.priority} />}
                    </div>
                    <p className="text-sm text-slate-600">
                      {d.emergencyRequest?.patient?.name ? `Patient: ${d.emergencyRequest.patient.name} · ` : ""}
                      Pickup: {d.emergencyRequest?.pickupAddress ?? "Unknown"}
                    </p>
                    {d.createdAt && (
                      <p className="text-xs text-slate-400">Assigned {when(d.createdAt)}</p>
                    )}
                  </div>
                  <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 justify-between">
                    <StatusBadge status={d.emergencyRequest?.status || d.status} />
                    <Link href={`/dispatches/${d.id}`} className="text-sm text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1">
                      View details <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          {res.meta.totalPages > 1 && (
            <Pagination base="/dispatches" meta={res.meta} params={sp} />
          )}
        </div>
      )}
    </div>
  );
}
