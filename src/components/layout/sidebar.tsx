"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, navForRole } from "@/lib/utils";
import type { Role } from "@/types/api";
import { useUiStore } from "@/store/ui";

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const items = navForRole(role);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 md:hidden",
          sidebarOpen ? "block" : "hidden",
        )}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-slate-900 text-white transition-transform md:static md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="border-b border-white/10 px-4 py-5">
          <p className="text-lg font-extrabold tracking-tight">
            Emergency Dispatch
          </p>
          <p className="text-xs text-slate-400">Command Center</p>
        </div>
        <nav aria-label="Main navigation" className="flex-1 space-y-1 p-3">
          {items.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-red-400",
                  active
                    ? "bg-red-600 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
