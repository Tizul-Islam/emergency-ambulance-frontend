import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { when } from "@/lib/utils";
import type { TripDetail } from "@/types/api";

export function PatientTripCard({ trip }: { trip: TripDetail }) {
  return (
    <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-800">TRIP #{trip.id.slice(0, 8).toUpperCase()}</h3>
          <StatusBadge status={trip.status} />
        </div>
        
        <div className="text-sm text-slate-600">
          <p>
            <span className="font-semibold text-slate-500">Ambulance:</span>{" "}
            {trip.ambulance?.registrationNumber || "Unassigned"}
          </p>
          <p>
            <span className="font-semibold text-slate-500">Pickup:</span>{" "}
            {trip.emergencyRequest?.pickupAddress || "Unknown"}
            {" → "}
            <span className="font-semibold text-slate-500">Hospital:</span>{" "}
            {trip.hospital?.name || "Pending Selection"}
          </p>
        </div>

        {trip.fare != null && (
          <p className="text-sm font-semibold text-green-700">
            Fare: BDT {trip.fare}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="text-xs text-slate-500">{when(trip.createdAt || "")}</span>
        <LinkButton href={`/trips/${trip.id}`} variant="outline" size="sm">
          View Details
        </LinkButton>
      </div>
    </Card>
  );
}
