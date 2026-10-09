"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/api/client";
import { ambulanceApi } from "@/lib/api/ambulance";
import { getAvailableDriversAction } from "@/actions/requests";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { z } from "zod";
import { ApiError } from "@/lib/api/client";
import type { Driver } from "@/types/api";

export default function AmbulanceCreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  
  const [form, setForm] = useState({
    registrationNumber: "",
    type: "BASIC",
    capacity: "",
    locationLat: "",
    locationLng: "",
    driverId: "unassigned",
  });

  useEffect(() => {
    async function loadDrivers() {
      try {
        const data = await getAvailableDriversAction();
        setDrivers(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Failed to load available drivers");
      } finally {
        setLoadingDrivers(false);
      }
    }
    loadDrivers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const client = createClient("/api/proxy");
      
      const rawPayload = {
        registrationNumber: form.registrationNumber.trim(),
        type: form.type,
        capacity: parseInt(String(form.capacity), 10),
        locationLat: parseFloat(String(form.locationLat)),
        locationLng: parseFloat(String(form.locationLng)),
        driverId: form.driverId === "unassigned" ? undefined : form.driverId,
      };

      const schema = z.object({
        registrationNumber: z.string().min(1, "Registration number is required"),
        type: z.enum(["BASIC", "ICU", "CARDIAC"]),
        capacity: z.number().int("Capacity must be an integer").positive("Capacity must be a positive integer"),
        locationLat: z.number().min(-90, "Latitude must be >= -90").max(90, "Latitude must be <= 90"),
        locationLng: z.number().min(-180, "Longitude must be >= -180").max(180, "Longitude must be <= 180"),
        driverId: z.string().uuid("Invalid driver ID").optional(),
      });

      const parsedPayload = schema.parse(rawPayload);

      await ambulanceApi.create(client, parsedPayload);
      toast.success("Ambulance created successfully");
      router.push("/ambulances");
      router.refresh();
    } catch (err) {
      console.error(err);
      if (err instanceof z.ZodError) {
        const errorMessages = err.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
      } else if (err instanceof ApiError) {
        toast.error(`API Error: ${err.message}`);
      } else {
        toast.error("Failed to create ambulance");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold">Add New Ambulance</h2>
      <Card className="max-w-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Registration Number <span className="text-red-500">*</span>
            </label>
            <Input
              name="registrationNumber"
              placeholder="e.g. DHK-1234"
              value={form.registrationNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Ambulance Type
              </label>
              <Select
                value={form.type}
                onValueChange={(val) => setForm((prev) => ({ ...prev, type: val as string }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BASIC">BASIC</SelectItem>
                  <SelectItem value="ICU">ICU</SelectItem>
                  <SelectItem value="CARDIAC">CARDIAC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Capacity (persons) <span className="text-red-500">*</span>
              </label>
              <Input
                name="capacity"
                type="number"
                min="1"
                placeholder="2"
                value={form.capacity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Initial Latitude <span className="text-red-500">*</span>
              </label>
              <Input
                name="locationLat"
                type="number"
                step="any"
                placeholder="23.75"
                value={form.locationLat}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Initial Longitude <span className="text-red-500">*</span>
              </label>
              <Input
                name="locationLng"
                type="number"
                step="any"
                placeholder="90.38"
                value={form.locationLng}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Assign Driver
            </label>
            <Select
              value={form.driverId}
              onValueChange={(val) => setForm((prev) => ({ ...prev, driverId: val as string }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingDrivers ? "Loading drivers..." : "Select a driver"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">-- Unassigned --</SelectItem>
                {drivers.map(d => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name} ({d.phone})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">You can leave it unassigned for now.</p>
          </div>

          <div className="pt-2 flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Create Ambulance"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
