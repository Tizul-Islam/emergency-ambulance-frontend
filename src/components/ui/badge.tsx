import { cn } from "@/lib/utils";
export const Badge = ({ className, ...p }: React.ComponentProps<"span">) => <span className={cn("inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold", className)} {...p} />;
