import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...i: ClassValue[]) => twMerge(clsx(i));
export const label = (s: string) =>
  s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, " ");
export const when = (d: string) =>
  new Date(d).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

export { HOME, navForRole } from "@/lib/constants/nav";
