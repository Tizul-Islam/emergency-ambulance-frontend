import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import { getSession } from "@/lib/session";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/url-controls";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import type { Driver, Paged } from "@/types/api";

export const metadata: Metadata = { title: "Drivers" };

export default async function DriversPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const user = await getSession();
  if (!user || (user.role !== "ADMIN" && user.role !== "DISPATCHER")) return null;

  const sp = await searchParams;
  const q = new URLSearchParams({
    page: sp.page ?? "1",
    limit: "10",
    ...(sp.status ? { status: sp.status } : {}),
  });

  let data: Driver[] = [];
  let meta = { page: 1, limit: 10, total: 0, totalPages: 1 };

  try {
    const res = await api<Paged<Driver>>(`/drivers?${q}`);
    data = res.data;
    meta = res.meta;
  } catch (error) {
    console.error("Failed to fetch drivers", error);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-extrabold">Drivers</h2>
        {user.role === "ADMIN" && (
          <LinkButton href="/drivers/new">Add Driver</LinkButton>
        )}
      </div>

      {data.length === 0 ? (
        <EmptyState title="No drivers found" hint="Create a driver to get started." />
      ) : (
        <div className="grid gap-3">
          {data.map((d) => (
            <Card key={d.id} className="flex flex-wrap items-center justify-between gap-2 p-4">
              <div>
                <p className="font-bold">{d.name}</p>
                <p className="text-sm text-slate-500">
                  Phone: {d.phone} | License: {d.licenseNumber}
                </p>
                {d.ambulanceId && (
                  <p className="text-sm text-blue-600 mt-1">Assigned Ambulance ID: {d.ambulanceId}</p>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <span className={`px-2 py-1 text-xs rounded font-medium ${
                  d.status === "AVAILABLE" ? "bg-emerald-100 text-emerald-800" :
                  d.status === "ON_TRIP" ? "bg-blue-100 text-blue-800" :
                  "bg-slate-100 text-slate-800"
                }`}>
                  {d.status || "OFF_DUTY"}
                </span>
                {user.role === "ADMIN" && (
                  <Link href={`/drivers/${d.id}/edit`} className="text-sm text-blue-600 underline">
                    Edit
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
      <Pagination base="/drivers" meta={meta} params={sp} />
    </div>
  );
}
