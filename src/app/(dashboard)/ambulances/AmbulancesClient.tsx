"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

import { createClient } from "@/lib/api/client";
import { ambulanceApi } from "@/lib/api/ambulance";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterChips, Pagination } from "@/components/shared/url-controls";
import { StatusBadge } from "@/components/shared/status-badge";
import { toast } from "sonner";
import type { Ambulance, Paged } from "@/types/api";

const OPTS = [
  { value: "", label: "All" },
  { value: "AVAILABLE", label: "Available" },
  { value: "EN_ROUTE", label: "En Route" },
  { value: "MAINTENANCE", label: "Maintenance" },
];

export default function AmbulancesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<Ambulance[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const page = searchParams.get("page") ?? "1";
  const status = searchParams.get("status");
  const type = searchParams.get("type");

  useEffect(() => {
    const q: Record<string, string | number> = {
      page: Number(page),
      limit: 10,
      ...(status ? { status } : {}),
      ...(type ? { type } : {}),
    };

    const apiClient = createClient("/api/proxy");
    ambulanceApi.list(apiClient, q)
      .then((result) => {
        if (result.data) {
          setData(result.data);
          setMeta(result.meta || { page: Number(page), limit: 10, total: 0, totalPages: 1 });
        } else {
          // fallback
          setData((result as unknown as { items?: Ambulance[] }).items || []);
          setMeta((result as unknown as { meta?: any }).meta || { page: Number(page), limit: 10, total: 0, totalPages: 1 });
        }
      })
      .catch(() => {
        setData([]);
        setMeta({ page: 1, limit: 10, total: 0, totalPages: 1 });
      });
  }, [page, status, type]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ambulance?")) return;
    try {
      const apiClient = createClient("/api/proxy");
      await ambulanceApi.delete(apiClient, id);
      toast.success("Ambulance deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete ambulance");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold">Ambulances</h2>
        <Button onClick={() => router.push("/ambulances/new")}>
          Add Ambulance
        </Button>
      </div>
      <FilterChips
        base="/ambulances"
        param="status"
        current={status ?? ""}
        params={Object.fromEntries(searchParams.entries())}
        options={OPTS}
      />
      {data.length === 0 ? (
        <EmptyState title="No ambulances found" hint="Try changing your filters." />
      ) : (
        <div className="grid gap-3">
          {data.map((amb) => (
            <Card key={amb.id} className="flex flex-wrap justify-between gap-2 p-4">
              <div>
                <Link href={`/ambulances/${amb.id}`} className="text-lg font-bold underline">
                  {amb.registrationNumber}
                </Link>
                <p className="text-sm text-slate-500">
                  Type: {amb.type}
                  {amb.capacity != null ? ` · Capacity: ${amb.capacity}` : ""}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={amb.status} />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(amb.id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/ambulances/${amb.id}/edit`)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Pagination base="/ambulances" meta={meta} params={Object.fromEntries(searchParams.entries())} />
    </div>
  );
}
