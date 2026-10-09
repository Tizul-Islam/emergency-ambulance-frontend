import type { Metadata } from "next";
import { api } from "@/lib/api";
import { getSession } from "@/lib/session";
import { StatCard } from "@/components/shared/stat-card";
import { StatsChart } from "@/components/features/stats-chart";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterChips, Pagination } from "@/components/shared/url-controls";
import { Card } from "@/components/ui/card";
import { when } from "@/lib/utils";
import type { DashboardStats, Paged, User } from "@/types/api";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; role?: string; tab?: string }>;
}) {
  const user = await getSession();
  if (!user) return null;
  const sp = await searchParams;

  const stats = await api<DashboardStats>("/admin/dashboard-stats").catch(
    () => null,
  );

  let users: Paged<User> | null = null;
  if (user.role === "ADMIN") {
    const q = new URLSearchParams({
      page: sp.page ?? "1",
      limit: "10",
      ...(sp.role ? { role: sp.role } : {}),
    });
    users = await api<Paged<User>>(`/admin/users?${q}`).catch(() => ({
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
    }));
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold">Analytics</h2>

      {stats ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Active trips" value={stats.activeTripsCount} />
            <StatCard title="Completed today" value={stats.completedTripsTodayCount} />
            <StatCard title="Ambulance utilisation" value={`${stats.ambulanceUtilization}%`} />
            <StatCard title="Avg response" value={`${stats.avgResponseTimeMin} min`} />
          </div>
          <Card>
            <h3 className="mb-2 font-bold">Emergency priority distribution</h3>
            <StatsChart data={stats.priorityBreakdown} />
          </Card>
        </>
      ) : (
        <EmptyState title="Analytics unavailable" hint="Could not load dashboard statistics." />
      )}

      {user.role === "ADMIN" && users && (
        <Card className="space-y-4">
          <h3 className="font-bold">User management</h3>
          <FilterChips
            base="/analytics"
            param="role"
            current={sp.role}
            params={sp}
            options={[
              { value: "", label: "All roles" },
              { value: "PATIENT", label: "Patient" },
              { value: "DISPATCHER", label: "Dispatcher" },
              { value: "ADMIN", label: "Admin" },
            ]}
          />
          {users.data.length === 0 ? (
            <p className="text-sm text-slate-500">No users found.</p>
          ) : (
            users.data.map((u) => (
              <div key={u.id} className="flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-3 first:border-0 first:pt-0">
                <div>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-sm text-slate-500">
                    {u.email} · {u.role}
                  </p>
                </div>
                <p className="text-sm text-slate-400">{u.createdAt ? when(u.createdAt) : ""}</p>
              </div>
            ))
          )}
          <Pagination base="/analytics" meta={users.meta} params={sp} />
        </Card>
      )}
    </div>
  );
}
