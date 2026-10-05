import type { Metadata } from "next";
import { api } from "@/lib/api";
import { StatCard } from "@/components/shared/stat-card";
import { StatsChart } from "@/components/features/stats-chart";
import { Card } from "@/components/ui/card";
import type { DashboardStats } from "@/types/api";
export const metadata: Metadata = { title: "Admin overview" };
export default async function Admin() {
  const s = await api<DashboardStats>("/admin/dashboard-stats");
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Overview</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active trips" value={s.activeTripsCount} />
        <StatCard title="Completed today" value={s.completedTripsTodayCount} />
        <StatCard
          title="Ambulance utilisation"
          value={`${s.ambulanceUtilization}%`}
        />
        <StatCard
          title="Average response"
          value={`${s.avgResponseTimeMin} min`}
        />
      </div>
      <Card>
        <h2 className="mb-2 font-bold">Requests by priority</h2>
        <StatsChart data={s.priorityBreakdown} />
      </Card>
    </div>
  );
}
