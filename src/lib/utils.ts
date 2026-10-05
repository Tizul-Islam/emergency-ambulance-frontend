import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Role } from "@/types/api";

export const cn = (...i: ClassValue[]) => twMerge(clsx(i));
export const HOME: Record<Role, string> = { PATIENT: "/dashboard", DISPATCHER: "/dispatcher", ADMIN: "/admin" };
export const NAV: Record<Role, { href: string; label: string }[]> = {
  PATIENT: [{ href: "/dashboard", label: "My requests" }, { href: "/dashboard/new-request", label: "New request" }],
  DISPATCHER: [{ href: "/dispatcher", label: "Queue" }, { href: "/dispatcher/requests", label: "All requests" }],
  ADMIN: [{ href: "/admin", label: "Overview" }, { href: "/dispatcher", label: "Queue" }, { href: "/dispatcher/requests", label: "All requests" }],
};
export const label = (s: string) => s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " ");
export const when = (d: string) => new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
