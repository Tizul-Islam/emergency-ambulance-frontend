import { cn } from "@/lib/utils";
export function Input({ className, ...p }: React.ComponentProps<"input">) {
  return <input className={cn("h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus-visible:outline-2 focus-visible:outline-teal-600", className)} {...p} />;
}
