"use client";

import { Menu, Bell } from "lucide-react";
import { useUiStore } from "@/store/ui";
import { Button } from "@/components/ui/button";
import type { SessionUser } from "@/types/api";
import Link from "next/link";
import { LogoutButton } from "./logout-button";
import { useNotificationsStore } from "@/store/notifications";

export function Header({
  user,
  title,
}: {
  user: SessionUser;
  title?: string;
}) {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const unreadCount = useNotificationsStore((s) => s.unreadCount);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="md:hidden"
          aria-label="Open navigation menu"
          onClick={toggleSidebar}
        >
          <Menu className="size-4" />
        </Button>
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            {title ?? "Dashboard"}
          </h1>
          <p className="text-xs text-slate-500 capitalize">
            {user.role.toLowerCase()} account
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/notifications"
          aria-label="Notifications"
          className="relative rounded-md p-2 text-slate-600 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-red-400"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-2.5 items-center justify-center rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </Link>
        <span className="hidden text-sm text-slate-600 sm:inline">
          {user.name}
        </span>
        <LogoutButton />
      </div>
    </header>
  );
}
