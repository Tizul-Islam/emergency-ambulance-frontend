import { z } from "zod";
export const loginSchema = z.object({ email: z.string().email("Enter a valid email address"), password: z.string().min(1, "Password is required") });
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export const requestSchema = z.object({
  description: z.string().min(5, "Describe the emergency in at least 5 characters"),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  pickupAddress: z.string().min(3, "Pickup address is required"),
  pickupLat: z.number({ message: "Enter a valid latitude" }).min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
  pickupLng: z.number({ message: "Enter a valid longitude" }).min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
});
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type RequestInput = z.infer<typeof requestSchema>;
