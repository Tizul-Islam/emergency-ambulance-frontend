import type { Metadata } from "next";
import { api } from "@/lib/api";
import { when } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ProfileForm } from "@/components/features/profile-form";
import type { User } from "@/types/api";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const user = await api<User>("/users/me").catch(() => null);

  if (!user) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-extrabold">Profile</h2>
        <Card className="p-6 text-center text-slate-500">
          Failed to load profile data.
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-2xl font-extrabold">Profile</h2>
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <div>
            <p className="text-xl font-bold">{user.name}</p>
            <p className="text-sm font-semibold capitalize text-red-700">
              {user.role.toLowerCase()}
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl font-bold text-red-700">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <dl className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <dt className="text-sm font-semibold text-slate-500">Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-slate-500">Phone</dt>
            <dd>{user.phone ?? "—"}</dd>
          </div>
          {user.createdAt && (
            <div>
              <dt className="text-sm font-semibold text-slate-500">Member since</dt>
              <dd>{when(user.createdAt)}</dd>
            </div>
          )}
        </dl>
        <ProfileForm user={user} />
      </Card>
    </div>
  );
}
