import { z } from "zod";

export const hospitalSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  emergencyAvailable: z.boolean().optional(),
});

export type HospitalFormData = z.infer<typeof hospitalSchema>;
