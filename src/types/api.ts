export type Role = "PATIENT" | "DISPATCHER" | "ADMIN";
export type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export const REQUEST_FLOW = ["REQUESTED","PRIORITY_ASSIGNED","AMBULANCE_ASSIGNED","DRIVER_ACCEPTED","EN_ROUTE","PATIENT_PICKED_UP","TO_HOSPITAL","ARRIVED","COMPLETED"] as const;
export type RequestStatus = (typeof REQUEST_FLOW)[number] | "CANCELLED" | "FAILED";
export interface Meta { total: number; page: number; limit: number; totalPages: number }
export interface Paged<T> { data: T[]; meta: Meta }
export interface SessionUser { id: string; name: string; email: string; role: Role }
export interface LoginData { user: SessionUser; accessToken: string; refreshToken: string }
export interface Ambulance { id: string; registrationNumber: string; type: "BASIC" | "ICU" | "CARDIAC"; status: string }
export interface Driver { id: string; name: string; phone: string }
export interface Trip { id: string; fare: number | null; status: string }
export interface Dispatch { id: string; status: string; ambulance: Ambulance; driver: Driver | null; trips?: Trip[] }
export interface EmergencyRequest {
  id: string; description: string; pickupAddress: string; pickupLat: number; pickupLng: number;
  priority: Priority; status: RequestStatus; createdAt: string;
  patient?: { id: string; name: string; phone: string }; dispatches?: Dispatch[];
}
export interface DashboardStats {
  activeTripsCount: number; completedTripsTodayCount: number; ambulanceUtilization: number;
  avgResponseTimeMin: number; priorityBreakdown: { priority: Priority; count: number }[];
}
export interface ActionResult { error?: string; url?: string; id?: string; redirectTo?: string }
