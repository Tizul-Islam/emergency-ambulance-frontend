import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { SocketProvider } from "@/components/layout/socket-provider";
import { cookies } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user) redirect("/login");

  const token = (await cookies()).get("token")?.value;

  return (
    <SocketProvider token={token}>
      <div className="min-h-screen bg-slate-50 md:flex">
      <Sidebar role={user.role} />
      <div className="flex min-w-0 flex-1 flex-col md:ml-0">
        <Header user={user} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
      </div>
    </SocketProvider>
  );
}
