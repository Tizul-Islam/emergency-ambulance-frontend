import type { Role } from "@/types/api";

const ROUTE_RULES: [string, Role[]][] = [
  ["/emergencies/create", ["PATIENT"]],
  ["/analytics", ["DISPATCHER", "ADMIN"]],
  ["/dispatches", ["DISPATCHER", "ADMIN"]],
  ["/ambulances", ["DISPATCHER", "ADMIN"]],
  ["/hospitals", ["DISPATCHER", "ADMIN"]],
];

export const PROTECTED_PREFIXES = [
  "/dashboard",
  "/emergencies",
  "/ambulances",
  "/dispatches",
  "/hospitals",
  "/trips",
  "/payments",
  "/notifications",
  "/analytics",
  "/profile",
];

export function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function canAccess(pathname: string, role: Role) {
  const rule = ROUTE_RULES.find(
    ([p]) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (!rule) return true;
  return rule[1].includes(role);
}
