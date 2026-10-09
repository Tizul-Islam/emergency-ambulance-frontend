import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { getSession } from "@/lib/session";
import { ManualDispatchForm } from "@/components/features/manual-dispatch-form";
import type { EmergencyRequest } from "@/types/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  return { title: `Assign Dispatch - ${(await params).id.slice(0, 8)}` };
}

export default async function AssignDispatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSession();
  
  if (!user || user.role !== "DISPATCHER") {
    return notFound(); // Only dispatchers can access this manual assign page
  }

  let request: EmergencyRequest;
  try {
    request = await api<EmergencyRequest>(`/requests/${id}`);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold mb-4">Manual Dispatch</h2>
      <ManualDispatchForm request={request} />
    </div>
  );
}
