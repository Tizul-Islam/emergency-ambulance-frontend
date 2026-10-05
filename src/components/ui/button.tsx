import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
export const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:pointer-events-none disabled:opacity-50",
  { variants: {
      variant: { default: "bg-teal-700 text-white hover:bg-teal-800", destructive: "bg-red-600 text-white hover:bg-red-700", outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50", ghost: "hover:bg-slate-100" },
      size: { default: "h-10 px-4", sm: "h-8 px-3" } },
    defaultVariants: { variant: "default", size: "default" } });
type P = VariantProps<typeof buttonVariants>;
export function Button({ className, variant, size, ...p }: React.ComponentProps<"button"> & P) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...p} />;
}
export function LinkButton({ className, variant, size, ...p }: React.ComponentProps<typeof Link> & P) {
  return <Link className={cn(buttonVariants({ variant, size }), className)} {...p} />;
}
