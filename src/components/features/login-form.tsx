"use client";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { loginSchema, type LoginInput } from "@/schemas";
import { demoLoginAction, loginAction } from "@/actions/auth";
import type { ActionResult, Role } from "@/types/api";

const DEMOS: { role: Role; title: string; email: string }[] = [
  { role: "ADMIN", title: "Admin", email: "admin@dispatch.com" },
  { role: "DISPATCHER", title: "Dispatcher", email: "dispatcher1@dispatch.com" },
  { role: "PATIENT", title: "Patient", email: "patient1@dispatch.com" },
];

export function LoginForm() {
  const router = useRouter();
  const redirect = useSearchParams().get("redirect");
  const [pending, start] = useTransition();
  const [busy, setBusy] = useState<Role | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), mode: "onChange" });

  const done = (r: ActionResult) => {
    if (r.error || !r.redirectTo) { toast.error(r.error ?? "Login failed"); return; }
    router.replace(redirect?.startsWith("/") ? redirect : r.redirectTo);
    router.refresh();
  };
  return (
    <div className="space-y-4">
      <form className="space-y-3" onSubmit={handleSubmit((v) => start(async () => done(await loginAction(v))))} noValidate>
        <div><label htmlFor="email" className="mb-1 block text-sm font-semibold">Email</label><Input id="email" type="email" autoComplete="email" {...register("email")} />{errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}</div>
        <div><label htmlFor="password" className="mb-1 block text-sm font-semibold">Password</label><Input id="password" type="password" autoComplete="current-password" {...register("password")} />{errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}</div>
        <Button type="submit" className="w-full" disabled={pending}>{pending ? "Logging in..." : "Log in"}</Button>
      </form>
      <div className="flex items-center gap-3 text-sm text-slate-500"><span className="h-px flex-1 bg-slate-200" />or try a demo account<span className="h-px flex-1 bg-slate-200" /></div>
      <div className="grid gap-3 sm:grid-cols-3">
        {DEMOS.map((d) => (
          <Card key={d.role} className="text-center">
            <p className="font-bold">{d.title}</p><p className="mb-2 break-all text-xs text-slate-500">{d.email}</p>
            <Button size="sm" variant="outline" disabled={busy !== null} onClick={async () => { setBusy(d.role); done(await demoLoginAction(d.role)); setBusy(null); }}>{busy === d.role ? "Logging in..." : "Demo login"}</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
