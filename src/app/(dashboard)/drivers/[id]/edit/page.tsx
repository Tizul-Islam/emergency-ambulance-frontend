"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { z } from "zod";
import { createClient, ApiError, request } from "@/lib/api/client";
import type { Driver } from "@/types/api";

export default function DriverEditPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    licenseNumber: "",
    status: "AVAILABLE",
    userId: "",
  });

  useEffect(() => {
    async function loadDriver() {
      try {
        const client = createClient("/api/proxy");
        const driver = await request<Driver>(client, "GET", `/drivers/${id}`);
        setForm({
          name: driver.name ?? "",
          phone: driver.phone ?? "",
          licenseNumber: driver.licenseNumber ?? "",
          status: driver.status ?? "AVAILABLE",
          userId: driver.userId ?? "",
        });
      } catch (err) {
        toast.error("Failed to load driver");
        router.push("/drivers");
      } finally {
        setLoading(false);
      }
    }
    loadDriver();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const rawPayload = {
        name: form.name.trim() || undefined,
        phone: form.phone.trim() || undefined,
        licenseNumber: form.licenseNumber.trim() || undefined,
        status: form.status,
      };

      const schema = z.object({
        name: z.string().min(2, "Name must be at least 2 characters").optional(),
        phone: z.string().min(10, "Phone must be at least 10 characters").optional(),
        licenseNumber: z.string().min(5, "License number is required").optional(),
        status: z.enum(["AVAILABLE", "ON_TRIP", "OFF_DUTY"]).optional(),
      });

      const parsedPayload = schema.parse(rawPayload);
      const client = createClient("/api/proxy");

      await request(client, "PATCH", `/drivers/${id}`, parsedPayload);
      
      toast.success("Driver updated successfully");
      router.push("/drivers");
      router.refresh();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessages = err.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
      } else if (err instanceof ApiError) {
        toast.error(`API Error: ${err.message}`);
      } else {
        toast.error("Failed to update driver");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-4">Loading driver details...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold">Edit Driver</h2>
      <Card className="max-w-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <Input name="name" placeholder="e.g. Rahim Miah" value={form.name} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
            <Input name="phone" placeholder="01700000000" value={form.phone} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">License Number</label>
            <Input name="licenseNumber" placeholder="LIC-12345" value={form.licenseNumber} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <Select value={form.status} onValueChange={(val) => setForm((prev) => ({ ...prev, status: val as string }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">AVAILABLE</SelectItem>
                <SelectItem value="ON_TRIP">ON TRIP</SelectItem>
                <SelectItem value="OFF_DUTY">OFF DUTY</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Linked User ID (Read-only)</label>
            <Input name="userId" value={form.userId} readOnly disabled />
          </div>

          <div className="pt-2 flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Update Driver"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
