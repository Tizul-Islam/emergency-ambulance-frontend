import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { AmbulanceMap } from "@/components/maps/ambulance-map";
import type { Hospital } from "@/types/api";

export const metadata: Metadata = { title: "Hospital Details" };

export default async function HospitalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let hospital: Hospital;
  try {
    hospital = await api<Hospital>(`/hospitals/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold">{hospital.name}</h2>
      <Card className="space-y-2">
        <p>{hospital.address}</p>
        <p>Phone: {hospital.phone}</p>
        {hospital.emergencyAvailable != null && (
          <p>
            Emergency availability:{" "}
            {hospital.emergencyAvailable ? "Available" : "Limited"}
          </p>
        )}
      </Card>
      {hospital.latitude != null && hospital.longitude != null && (
        <Card>
          <h3 className="mb-3 font-bold">Location</h3>
          <AmbulanceMap
            lat={hospital.latitude}
            lng={hospital.longitude}
            label={hospital.name}
          />
        </Card>
      )}
    </div>
  );
}
