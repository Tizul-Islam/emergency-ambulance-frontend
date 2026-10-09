"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { hospitalApi } from "@/lib/api/hospital";
import { createClient } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/url-controls";
import { toast } from "sonner";
import type { Hospital, Paged } from "@/types/api";

export default function HospitalsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<Hospital[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");

  const page = searchParams.get("page") ?? "1";

  useEffect(() => {
    (async () => {
      try {
        const apiClient = createClient("/api/proxy");
        const result = await hospitalApi.list(apiClient, { page: Number(page), limit: 10, ...(search ? { q: search } : {}) });
        // The API returns Paged<Hospital> which contains { data, meta }
        if (result.data) {
          setData(result.data);
          setMeta(result.meta || { page: Number(page), limit: 10, total: 0, totalPages: 1 });
        } else {
          setData([]);
          setMeta({ page: 1, limit: 10, total: 0, totalPages: 1 });
        }
      } catch {
        setData([]);
        setMeta({ page: 1, limit: 10, total: 0, totalPages: 1 });
      }
    })();
  }, [page, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hospital?")) return;
    
    try {
      const apiClient = createClient("/api/proxy");
      await hospitalApi.delete(apiClient, id);
      toast.success("Hospital deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete hospital");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-extrabold">Hospitals</h2>
        <Button onClick={() => router.push("/hospitals/new")}>Add Hospital</Button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search hospitals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      {data.length === 0 ? (
        <EmptyState title="No hospitals found" hint="Add a hospital or adjust your search." />
      ) : (
        <div className="grid gap-3">
          {data.map((h) => (
            <Card key={h.id} className="flex flex-wrap justify-between gap-2 p-4">
              <div>
                <Link href={`/hospitals/${h.id}`} className="text-lg font-bold underline">
                  {h.name}
                </Link>
                <p className="text-sm text-slate-500">{h.address}</p>
                <p className="text-sm">
                  {h.phone}
                  {h.emergencyAvailable != null && (
                    <span className={h.emergencyAvailable ? " text-green-700" : " text-amber-700"}>
                      {" "}
                      · {h.emergencyAvailable ? "Emergency available" : "Limited capacity"}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(h.id)}
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/hospitals/${h.id}/edit`)}
                >
                  Edit
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Pagination base="/hospitals" meta={meta} params={Object.fromEntries(searchParams.entries())} />
    </div>
  );
}
