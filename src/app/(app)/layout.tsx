import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { NAV } from "@/lib/utils";
import { logoutAction } from "@/actions/auth";
import { NavLinks } from "@/components/layout/nav-links";
import { Button } from "@/components/ui/button";
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login");
  return (
    <div className="min-h-screen md:grid md:grid-cols-[220px_1fr]">
      <aside className="bg-slate-900 p-3 text-white">
        <p className="mb-2 px-3 text-lg font-extrabold">Dispatch</p>
        <nav aria-label={user.role} className="flex gap-1 overflow-x-auto md:flex-col"><NavLinks items={NAV[user.role]} /></nav>
        <form action={logoutAction} className="mt-3 border-t border-white/10 px-3 pt-3">
          <p className="mb-2 truncate text-xs text-slate-400">{user.name} ({user.role.toLowerCase()})</p>
          <Button variant="outline" size="sm" type="submit">Log out</Button>
        </form>
      </aside>
      <main className="min-w-0 p-4 md:p-6">{children}</main>
    </div>
  );
}
