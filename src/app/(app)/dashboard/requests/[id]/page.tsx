import type { Metadata } from "next";
import { api } from "@/lib/api";
import { getSession } from "@/lib/session";
import { RequestDetail } from "@/components/features/request-detail";
import type { EmergencyRequest } from "@/types/api";
export const metadata: Metadata = { title: "Request status" };
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [request, user] = await Promise.all([
    api<EmergencyRequest>(`/requests/${id}`),
    getSession(),
  ]);
  return <RequestDetail request={request} role={user!.role} />;
}
