import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { getSession } from "@/lib/session";
import { Card } from "@/components/ui/card";
import { StatusBadge, PriorityBadge } from "@/components/shared/status-badge";
import { StatusControl } from "@/components/features/status-control";
import { DispatchStatusTimeline } from "@/components/features/dispatch-status-timeline";
import { AmbulanceMap } from "@/components/maps/ambulance-map";
import { ActionButton } from "@/components/features/action-button";
import { cancelRequestAction } from "@/actions/requests";
import type { Dispatch } from "@/types/api";

export const metadata: Metadata = { title: "Dispatch Details" };

export default async function DispatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSession();
  if (!user) return null;

  let dispatch: Dispatch;
  try {
    dispatch = await api<Dispatch>(`/dispatches/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  const req = dispatch.emergencyRequest;
  const active = !["COMPLETED", "CANCELLED", "FAILED"].includes(req?.status || dispatch.status);
  
  // Find the selected hospital if any
  const trip = dispatch.trips?.[0];
  const hospital = (trip as any)?.hospital;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Dispatch #{dispatch.id.slice(0, 8)}</h2>
          {dispatch.createdAt && <p className="text-sm text-slate-500">Created: {new Date(dispatch.createdAt).toLocaleString()}</p>}
        </div>
        <StatusBadge status={req?.status || dispatch.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5 border-t-4 border-t-blue-500">
              <h3 className="mb-3 font-bold text-slate-800">Patient Information</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-500">Name:</span> {req?.patient?.name || "Unknown"}</p>
                {req?.patient?.phone && <p><span className="font-semibold text-slate-500">Phone:</span> {req.patient.phone}</p>}
                <p className="flex items-center gap-2"><span className="font-semibold text-slate-500">Priority:</span> {req && <PriorityBadge priority={req.priority} />}</p>
                <p><span className="font-semibold text-slate-500">Emergency:</span> {req?.description}</p>
              </div>
            </Card>

            <Card className="p-5 border-t-4 border-t-orange-500">
              <h3 className="mb-3 font-bold text-slate-800">Pickup Information</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-500">Location:</span> {req?.pickupAddress}</p>
                <p><span className="font-semibold text-slate-500">Coordinates:</span> {req?.pickupLat.toFixed(4)}, {req?.pickupLng.toFixed(4)}</p>
              </div>
            </Card>

            <Card className="p-5 border-t-4 border-t-emerald-500">
              <h3 className="mb-3 font-bold text-slate-800">Ambulance Information</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-500">Reg Number:</span> <span className="font-bold">{dispatch.ambulance.registrationNumber}</span></p>
                <p><span className="font-semibold text-slate-500">Type:</span> {dispatch.ambulance.type}</p>
                <p><span className="font-semibold text-slate-500">Capacity:</span> {dispatch.ambulance.capacity || "N/A"}</p>
                <p><span className="font-semibold text-slate-500">Status:</span> {dispatch.ambulance.status}</p>
              </div>
            </Card>

            <Card className="p-5 border-t-4 border-t-indigo-500">
              <h3 className="mb-3 font-bold text-slate-800">Driver Information</h3>
              {dispatch.driver ? (
                <div className="space-y-2 text-sm text-slate-600">
                  <p><span className="font-semibold text-slate-500">Name:</span> {dispatch.driver.name}</p>
                  <p><span className="font-semibold text-slate-500">Phone:</span> {dispatch.driver.phone}</p>
                  <p><span className="font-semibold text-slate-500">License:</span> {dispatch.driver.licenseNumber || "N/A"}</p>
                  <p><span className="font-semibold text-slate-500">Status:</span> {dispatch.driver.status || "N/A"}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No driver assigned</p>
              )}
            </Card>
            
            {hospital && (
              <Card className="p-5 border-t-4 border-t-rose-500 sm:col-span-2">
                <h3 className="mb-3 font-bold text-slate-800">Destination Hospital</h3>
                <div className="space-y-2 text-sm text-slate-600">
                  <p><span className="font-semibold text-slate-500">Hospital:</span> <span className="font-bold text-slate-800">{hospital.name}</span></p>
                  <p><span className="font-semibold text-slate-500">Address:</span> {hospital.address}</p>
                  <p><span className="font-semibold text-slate-500">Phone:</span> {hospital.phone}</p>
                </div>
              </Card>
            )}
          </div>

          <Card className="overflow-hidden">
            <h3 className="p-5 pb-0 font-bold text-slate-800">Live Tracking</h3>
            <div className="h-[400px]">
              <AmbulanceMap
                lat={dispatch.ambulance.locationLat}
                lng={dispatch.ambulance.locationLng}
                label={dispatch.ambulance.registrationNumber}
                pickupLat={req?.pickupLat}
                pickupLng={req?.pickupLng}
              />
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-5">
            <h3 className="mb-6 font-bold text-slate-800 border-b pb-2">DISPATCH STATUS TIMELINE</h3>
            <DispatchStatusTimeline currentStatus={req?.status || dispatch.status as any} />
          </Card>

          {user.role !== "PATIENT" && active && req && (
            <Card className="p-5 border-dashed border-2 border-slate-300 bg-slate-50/50">
              <h3 className="mb-3 font-bold text-slate-800">Dispatch Actions</h3>
              <StatusControl dispatchId={dispatch.id} current={req.status as any} />
            </Card>
          )}

          {active && (user.role === "PATIENT" || user.role === "DISPATCHER") && req && (
             <div className="flex justify-end">
               <ActionButton 
                 action={() => cancelRequestAction(req.id)}
                 success="Dispatch cancelled"
                 className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-none w-full"
               >
                 Cancel Dispatch
               </ActionButton>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
