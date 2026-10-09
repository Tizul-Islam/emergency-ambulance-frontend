import type { Role } from "@/types/api";

export type NavItem = { href: string; label: string; roles: Role[] };

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", roles: ["PATIENT", "DISPATCHER", "ADMIN"] },
  { href: "/emergencies/create", label: "Create Emergency", roles: ["PATIENT"] },
  { href: "/emergencies", label: "Emergencies", roles: ["PATIENT", "DISPATCHER", "ADMIN"] },
  { href: "/dispatches", label: "Dispatches", roles: ["DISPATCHER", "ADMIN"] },
  { href: "/ambulances", label: "Ambulances", roles: ["DISPATCHER", "ADMIN"] },
  { href: "/drivers", label: "Drivers", roles: ["DISPATCHER", "ADMIN"] },
  { href: "/hospitals", label: "Hospitals", roles: ["DISPATCHER", "ADMIN"] },
  { href: "/trips", label: "Trips", roles: ["PATIENT", "DISPATCHER", "ADMIN"] },
  { href: "/payments", label: "Payments", roles: ["PATIENT", "ADMIN"] },
  { href: "/notifications", label: "Notifications", roles: ["PATIENT", "DISPATCHER", "ADMIN"] },
  { href: "/analytics", label: "Analytics", roles: ["DISPATCHER", "ADMIN"] },
  { href: "/profile", label: "Profile", roles: ["PATIENT", "DISPATCHER", "ADMIN"] },
];

export function navForRole(role: Role) {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}

export const HOME = "/dashboard";
