import { cn } from "@/lib/utils";
export const Card = ({ className, ...p }: React.ComponentProps<"div">) => <div className={cn("rounded-xl border border-slate-200 bg-white p-4", className)} {...p} />;
