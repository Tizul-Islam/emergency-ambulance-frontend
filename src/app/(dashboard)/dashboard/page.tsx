import type { Metadata } from "next";
import Link from "next/link";
import { api } from "@/lib/api";
import { StatCard } from "@/components/shared/stat-card";
import { StatsChart } from "@/components/features/stats-chart";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import type { Ambulance } from "@/types/api";
import { PriorityBadge, StatusBadge, PaymentBadge } from "@/components/shared/status-badge";
import { AutoRefresh } from "@/components/features/auto-refresh";
import { EmptyState } from "@/components/shared/empty-state";
import { when } from "@/lib/utils";
import { getSession } from "@/lib/session";
import type {
  DashboardStats,
  EmergencyRequest,
  Paged,
} from "@/types/api";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) return null;

  if (user.role === "ADMIN" || user.role === "DISPATCHER") {
    const stats = await api<DashboardStats>("/admin/dashboard-stats").catch(
      () => null,
    );
    const ambulancesRes = await api<Paged<Ambulance>>("/ambulances?limit=10").catch(() => ({ data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 1 } }));
    const queue =
      user.role === "DISPATCHER"
        ? await api<EmergencyRequest[]>("/requests/queue").catch(() => [])
        : [];

    return (
      <div className="space-y-4">
        <AutoRefresh every={30000} />
        <h2 className="text-2xl font-extrabold text-slate-900">Command Center</h2>
        {stats && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Active trips" value={stats.activeTripsCount} />
            <StatCard
              title="Completed today"
              value={stats.completedTripsTodayCount}
            />
            <StatCard
              title="Ambulance utilisation"
              value={`${stats.ambulanceUtilization}%`}
            />
            <StatCard
              title="Avg response"
              value={`${stats.avgResponseTimeMin} min`}
            />
          </div>
        )}
        {stats && (
          <Card>
            <h3 className="mb-2 font-bold">Priority distribution</h3>
            <StatsChart data={stats.priorityBreakdown} />
          </Card>
        )}
        {/* Ambulance list */}
        {ambulancesRes.data.length > 0 && (
          <Card className="space-y-3">
            <h3 className="font-bold">Available Ambulances</h3>
            <div className="grid gap-2">
              {ambulancesRes.data.map((amb) => (
                <div key={amb.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 first:border-0 first:pt-0">
                  <Link href={`/ambulances/${amb.id}`} className="font-semibold underline">
                    {amb.registrationNumber}
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{amb.type}</span>
                    <StatusBadge status={amb.status} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
        {user.role === "DISPATCHER" && (
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Pending queue</h3>
              <LinkButton href="/emergencies" size="sm" variant="outline">
                View all
              </LinkButton>
            </div>
            {queue.length === 0 ? (
              <p className="text-sm text-slate-500">No pending emergencies.</p>
            ) : (
              queue.slice(0, 5).map((r) => (
                <div
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 first:border-0 first:pt-0"
                >
                  <Link
                    href={`/emergencies/${r.id}`}
                    className="font-semibold text-red-700 underline"
                  >
                    {r.description}
                  </Link>
                  <PriorityBadge priority={r.priority} />
                </div>
              ))
            )}
          </Card>
        )}
      </div>
    );
  }

  const res = await api<Paged<EmergencyRequest>>("/requests/my?page=1&limit=5");
  const active = res.data.filter(
    (r) => !["COMPLETED", "CANCELLED", "FAILED"].includes(r.status),
  );

  return (
    <div className="space-y-4">
      <AutoRefresh every={30000} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-extrabold text-slate-900">
          Patient Dashboard
        </h2>
        <LinkButton href="/emergencies/create" variant="destructive">
          Create Emergency
        </LinkButton>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard title="Active requests" value={active.length} />
        <StatCard title="Total requests" value={res.meta.total} />
        <StatCard
          title="Recent"
          value={res.data[0] ? labelStatus(res.data[0].status) : "None"}
        />
      </div>
      <Card className="space-y-3">
        <h3 className="font-bold">Recent emergencies</h3>
        {res.data.length === 0 ? (
          <EmptyState
            title="No emergencies yet"
            hint="Create an emergency request when you need ambulance assistance."
          />
        ) : (
          res.data.map((r) => (
            <div
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 first:border-0 first:pt-0"
            >
              <div>
                <Link
                  href={`/emergencies/${r.id}`}
                  className="font-semibold underline"
                >
                  {r.description}
                </Link>
                <p className="text-sm text-slate-500">
                  {r.pickupAddress} · {when(r.createdAt)}
                </p>
              </div>
              <span className="flex gap-2">
                <PriorityBadge priority={r.priority} />
                <StatusBadge status={r.status} />
                {r.trips?.[0] && <PaymentBadge status={r.trips[0].payment?.status} fare={r.trips[0].fare} />}
              </span>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

function labelStatus(s: string) {
  return s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " ");
}
