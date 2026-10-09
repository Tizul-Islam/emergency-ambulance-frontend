import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { getSession } from "@/lib/session";
import { RequestDetail } from "@/components/features/request-detail";
import { AmbulanceMap } from "@/components/maps/ambulance-map";
import { Card } from "@/components/ui/card";
import type { EmergencyRequest } from "@/types/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  return { title: `Emergency ${(await params).id.slice(0, 8)}` };
}

export default async function EmergencyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSession();
  if (!user) return null;

  let request: EmergencyRequest;
  try {
    request = await api<EmergencyRequest>(`/requests/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  const dispatch = request.dispatches?.[0];
  const ambulance = dispatch?.ambulance;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold">Emergency Details</h2>
      <RequestDetail request={request} role={user.role} />
      <Card>
        <h3 className="mb-3 font-bold">Live tracking</h3>
        <AmbulanceMap
          lat={ambulance?.locationLat}
          lng={ambulance?.locationLng}
          label={ambulance?.registrationNumber}
          pickupLat={request.pickupLat}
          pickupLng={request.pickupLng}
        />
      </Card>
    </div>
  );
}
