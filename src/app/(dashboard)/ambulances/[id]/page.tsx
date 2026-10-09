import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { AmbulanceMap } from "@/components/maps/ambulance-map";
import type { Ambulance } from "@/types/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  return { title: "Ambulance Details" };
}

export default async function AmbulanceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let amb: Ambulance;
  try {
    amb = await api<Ambulance>(`/ambulances/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold">{amb.registrationNumber}</h2>
      <Card className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Status:</span>
          <StatusBadge status={amb.status} />
        </div>
        <p className="text-sm">Type: {amb.type}</p>
        {amb.capacity != null && <p className="text-sm">Capacity: {amb.capacity}</p>}
        {amb.driver && (
          <p className="text-sm">
            Driver: {amb.driver.name} · {amb.driver.phone}
          </p>
        )}
      </Card>
      <Card>
        <h3 className="mb-3 font-bold">Location</h3>
        <AmbulanceMap lat={amb.locationLat} lng={amb.locationLng} label={amb.registrationNumber} />
      </Card>
    </div>
  );
}
