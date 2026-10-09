import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import { getSession } from "@/lib/session";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { ActionButton } from "@/components/features/action-button";
import { DispatchStatusTimeline } from "@/components/features/dispatch-status-timeline";
import { payAction } from "@/actions/requests";
import { when } from "@/lib/utils";
import type { TripDetail } from "@/types/api";

export const metadata: Metadata = { title: "Trip Details" };

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSession();
  if (!user) return null;

  const { id } = await params;
  let trip: TripDetail;
  try {
    trip = await api<TripDetail>(`/trips/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  const canPay = user.role === "PATIENT" && trip.status === "COMPLETED" && trip.fare != null && !trip.payment;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold">Trip Details</h2>

      <Card className="space-y-4 p-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Status:</span>
          <StatusBadge status={trip.status} />
        </div>

        {trip.fare != null && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Fare:</span>
            <span>BDT {trip.fare}</span>
          </div>
        )}

        {trip.distance != null && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Distance:</span>
            <span>{trip.distance.toFixed(1)} km</span>
          </div>
        )}

        {trip.createdAt && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Created:</span>
            <span>{when(trip.createdAt)}</span>
          </div>
        )}
        
        {trip.startedAt && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Started:</span>
            <span>{when(trip.startedAt)}</span>
          </div>
        )}

        {trip.completedAt && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Completed:</span>
            <span>{when(trip.completedAt)}</span>
          </div>
        )}

        {trip.payment && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Payment:</span>
            <span className={trip.payment.status === "PAID" ? "text-green-700 font-semibold" : "text-amber-700"}>
              {trip.payment.status}
            </span>
            <span>· BDT {trip.payment.amount}</span>
            {trip.payment.provider && <span>· {trip.payment.provider}</span>}
          </div>
        )}

        {trip.emergencyRequest && (
          <div>
            <span className="font-semibold">Emergency:</span>
            <Link href={`/emergencies/${trip.emergencyRequest.id}`} className="ml-2 underline">
              {trip.emergencyRequest.description}
            </Link>
            <p className="mt-1 text-sm text-slate-500">
              {trip.emergencyRequest.pickupAddress}
            </p>
          </div>
        )}

        {trip.dispatch && (
          <div>
            <span className="font-semibold">Dispatch:</span>
            <Link href={`/dispatches/${trip.dispatch.id}`} className="ml-2 underline">
              View Dispatch
            </Link>
            {trip.ambulance && (
              <p className="mt-1 text-sm text-slate-500">
                Ambulance: {trip.ambulance.registrationNumber}
              </p>
            )}
          </div>
        )}
      </Card>

      {trip.hospital && (
        <Card className="p-4">
          <h3 className="mb-2 font-bold text-slate-800">DESTINATION HOSPITAL</h3>
          <p className="font-semibold">{trip.hospital.name}</p>
          <p className="text-sm text-slate-500">{trip.hospital.address}</p>
          {trip.hospital.phone && <p className="text-sm text-slate-500">{trip.hospital.phone}</p>}
        </Card>
      )}

      {trip.emergencyRequest && (
        <Card className="p-4">
          <h3 className="mb-4 font-bold text-slate-800">TRIP STATUS TIMELINE</h3>
          <DispatchStatusTimeline currentStatus={trip.emergencyRequest.status} />
        </Card>
      )}

      {canPay && (
        <ActionButton action={payAction.bind(null, trip.id)}>
          Pay BDT {trip.fare} with Stripe
        </ActionButton>
      )}
    </div>
  );
}
