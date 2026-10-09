"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { z } from "zod";
import { createDriverAction } from "@/actions/drivers";

export default function DriverCreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    licenseNumber: "",
    userId: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const rawPayload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        licenseNumber: form.licenseNumber.trim(),
        userId: form.userId.trim() || undefined,
      };

      const schema = z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        phone: z.string().min(10, "Phone must be at least 10 characters"),
        licenseNumber: z.string().min(5, "License number is required"),
        userId: z.string().uuid("Invalid User ID").optional(),
      });

      const parsedPayload = schema.parse(rawPayload);

      const res = await createDriverAction(parsedPayload);
      
      if (res?.error) {
        toast.error(`Error: ${res.error}`);
        return;
      }
      
      toast.success("Driver created successfully");
      router.push("/drivers");
      router.refresh();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessages = err.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
      } else {
        toast.error("Failed to create driver");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold">Add New Driver</h2>
      <Card className="max-w-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              placeholder="e.g. Rahim Miah"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input
              name="phone"
              placeholder="01700000000"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              License Number <span className="text-red-500">*</span>
            </label>
            <Input
              name="licenseNumber"
              placeholder="LIC-12345"
              value={form.licenseNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Linked User ID (Optional)
            </label>
            <Input
              name="userId"
              placeholder="Valid UUID of a user"
              value={form.userId}
              onChange={handleChange}
            />
            <p className="text-xs text-slate-500 mt-1">If the driver also uses the app, provide their User UUID here.</p>
          </div>

          <div className="pt-2 flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Create Driver"}
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
