"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hospitalSchema, type HospitalFormData } from "@/lib/validations/hospital";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { hospitalApi } from "@/lib/api/hospital";
import { createClient } from "@/lib/api/client";
import type { Hospital } from "@/types/api";

export default function EditHospitalPage() {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hospital, setHospital] = useState<Hospital | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HospitalFormData>({
    resolver: zodResolver(hospitalSchema),
  });

  useEffect(() => {
    const fetchHospital = async () => {
      try {
        const apiClient = createClient("/api/proxy");
        const data = await hospitalApi.byId(apiClient, String(params.id));
        
        setHospital(data);
        reset({
          name: data.name,
          address: data.address,
          phone: data.phone,
          latitude: data.latitude,
          longitude: data.longitude,
          emergencyAvailable: data.emergencyAvailable,
        });
      } catch (error) {
        toast.error("Failed to load hospital");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchHospital();
  }, [params.id, router, reset]);

  const onSubmit = async (data: HospitalFormData) => {
    setIsSubmitting(true);
    try {
      const apiClient = createClient("/api/proxy");
      await hospitalApi.update(apiClient, String(params.id), data);

      toast.success("Hospital updated successfully");
      router.push(`/hospitals/${params.id}`);
    } catch (error) {
      toast.error("Failed to update hospital");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold">Edit Hospital</h2>
      <Card className="max-w-2xl space-y-4 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Hospital Name
            </label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Central Hospital"
              className="mt-1"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-700">
              Address
            </label>
            <Input
              id="address"
              {...register("address")}
              placeholder="1 Main Road, Dhaka"
              className="mt-1"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
              Phone Number
            </label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="01912345678"
              className="mt-1"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-slate-700">
                Latitude (optional)
              </label>
              <Input
                id="latitude"
                type="number"
                step="any"
                {...register("latitude", { valueAsNumber: true })}
                placeholder="23.75"
                className="mt-1"
              />
              {errors.latitude && (
                <p className="mt-1 text-sm text-red-600">{errors.latitude.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-slate-700">
                Longitude (optional)
              </label>
              <Input
                id="longitude"
                type="number"
                step="any"
                {...register("longitude", { valueAsNumber: true })}
                placeholder="90.38"
                className="mt-1"
              />
              {errors.longitude && (
                <p className="mt-1 text-sm text-red-600">{errors.longitude.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="emergencyAvailable"
              type="checkbox"
              {...register("emergencyAvailable")}
              className="h-4 w-4 rounded border-slate-300"
            />
            <label htmlFor="emergencyAvailable" className="text-sm text-slate-700">
              Emergency Available
            </label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Hospital"}
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
