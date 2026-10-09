"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/api/client";
import { ambulanceApi } from "@/lib/api/ambulance";
import { z } from "zod";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";

type AmbulanceForm = {
  registrationNumber: string;
  type: string;
  capacity: string;
  status: string;
  locationLat: string;
  locationLng: string;
};

export default function AmbulanceEditPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };
  const [form, setForm] = useState<AmbulanceForm>({
    registrationNumber: "",
    type: "BASIC",
    capacity: "",
    status: "AVAILABLE",
    locationLat: "",
    locationLng: "",
  });

  useEffect(() => {
    const fetchAmbulance = async () => {
      const client = createClient("/api/proxy");
      const amb = await ambulanceApi.byId(client, id);
      setForm({
        registrationNumber: amb.registrationNumber ?? "",
        type: amb.type ?? "BASIC",
        capacity: amb.capacity ? String(amb.capacity) : "",
        status: amb.status ?? "AVAILABLE",
        locationLat: amb.locationLat ? String(amb.locationLat) : "",
        locationLng: amb.locationLng ? String(amb.locationLng) : "",
      });
    };
    fetchAmbulance();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const client = createClient("/api/proxy");
    
    const rawPayload = {
      registrationNumber: form.registrationNumber.trim() || undefined,
      type: form.type as any,
      capacity: form.capacity ? parseInt(String(form.capacity), 10) : undefined,
      status: form.status,
      locationLat: form.locationLat ? parseFloat(String(form.locationLat)) : undefined,
      locationLng: form.locationLng ? parseFloat(String(form.locationLng)) : undefined,
    };

    const schema = z.object({
      registrationNumber: z.string().min(1).optional(),
      type: z.enum(["BASIC", "ICU", "CARDIAC"]).optional(),
      status: z.enum(["AVAILABLE", "ASSIGNED", "EN_ROUTE", "PICKING_UP", "TO_HOSPITAL", "MAINTENANCE", "OFFLINE"]).optional(),
      capacity: z.number().int().positive().optional(),
      locationLat: z.number().min(-90).max(90).optional(),
      locationLng: z.number().min(-180).max(180).optional(),
    });

    try {
      const parsedPayload = schema.parse(rawPayload);
      await ambulanceApi.update(client, id, parsedPayload);
      toast.success("Ambulance updated successfully");
      router.push(`/ambulances/${id}`);
    } catch (err) {
      console.error(err);
      if (err instanceof z.ZodError) {
        const errorMessages = err.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
      } else if (err instanceof ApiError) {
        toast.error(`API Error: ${err.message}`);
      } else {
        toast.error("Failed to update ambulance");
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit Ambulance</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="registrationNumber" placeholder="Registration Number" value={form.registrationNumber} onChange={handleChange} />
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
        <Input name="capacity" type="number" placeholder="Capacity" value={form.capacity} onChange={handleChange} />
        <Select
          value={form.status}
          onValueChange={(val) => setForm((prev) => ({ ...prev, status: val as string }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AVAILABLE">AVAILABLE</SelectItem>
            <SelectItem value="EN_ROUTE">EN ROUTE</SelectItem>
            <SelectItem value="MAINTENANCE">MAINTENANCE</SelectItem>
          </SelectContent>
        </Select>
        <Input name="locationLat" type="number" placeholder="Latitude" value={form.locationLat} onChange={handleChange} />
        <Input name="locationLng" type="number" placeholder="Longitude" value={form.locationLng} onChange={handleChange} />
        <Button type="submit" className="w-full">Update</Button>
      </form>
    </div>
  );
}
