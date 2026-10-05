"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
export function NavLinks({ items }: { items: { href: string; label: string }[] }) {
  const path = usePathname();
  return (
    <>{items.map((i) => (
      <Link key={i.href} href={i.href} aria-current={path === i.href ? "page" : undefined}
        className={cn("whitespace-nowrap rounded-md px-3 py-2 text-sm", path === i.href ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10")}>{i.label}</Link>
    ))}</>
  );
}
