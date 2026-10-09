export type Role = "PATIENT" | "DISPATCHER" | "ADMIN";
export type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export const REQUEST_FLOW = [
  "REQUESTED",
  "PRIORITY_ASSIGNED",
  "AMBULANCE_ASSIGNED",
  "DRIVER_ACCEPTED",
  "EN_ROUTE",
  "PATIENT_PICKED_UP",
  "TO_HOSPITAL",
  "ARRIVED",
  "COMPLETED",
] as const;
export type RequestStatus =
  | (typeof REQUEST_FLOW)[number]
  | "CANCELLED"
  | "FAILED";
export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  unreadCount?: number;
}
export interface Paged<T> {
  data: T[];
  meta: Meta;
}
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}
export interface User extends SessionUser {
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
}
export interface LoginData {
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
}
export interface Ambulance {
  id: string;
  registrationNumber: string;
  type: "BASIC" | "ICU" | "CARDIAC";
  status: string;
  capacity?: number;
  locationLat?: number | null;
  locationLng?: number | null;
  driverId?: string | null;
  driver?: Driver | null;
}
export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber?: string;
  status?: string;
  ambulanceId?: string | null;
  userId?: string | null;
}
export interface Trip {
  id: string;
  fare: number | null;
  status: string;
  distance?: number | null;
  startedAt?: string | null;
  pickedUpAt?: string | null;
  arrivedAt?: string | null;
  completedAt?: string | null;
  payment?: Payment | null;
}
export interface TripDetail extends Trip {
  createdAt?: string;
  emergencyRequest?: EmergencyRequest;
  dispatch?: Dispatch;
  ambulance?: Ambulance;
  hospital?: Hospital | null;
}
export interface Dispatch {
  id: string;
  status: string;
  ambulance: Ambulance;
  driver: Driver | null;
  trips?: Trip[];
  emergencyRequest?: EmergencyRequest;
  createdAt?: string;
}
export interface EmergencyRequest {
  id: string;
  description: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  priority: Priority;
  status: RequestStatus;
  createdAt: string;
  patient?: { id: string; name: string; phone: string };
  dispatches?: Dispatch[];
  trips?: Trip[];
}
export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  emergencyAvailable?: boolean;
}
export interface Payment {
  id: string;
  amount: number;
  status: string;
  provider?: string;
  tripId?: string;
  createdAt?: string;
}
export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
export interface DashboardStats {
  activeTripsCount: number;
  completedTripsTodayCount: number;
  ambulanceUtilization: number;
  avgResponseTimeMin: number;
  priorityBreakdown: { priority: Priority; count: number }[];
}
export interface ActionResult {
  error?: string;
  url?: string;
  id?: string;
  redirectTo?: string;
}
