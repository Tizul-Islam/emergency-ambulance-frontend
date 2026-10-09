"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginInput } from "@/schemas";
import { demoLoginAction, loginAction } from "@/actions/auth";
import { DEMO_CREDENTIALS } from "@/lib/constants/demo-credentials";
import type { ActionResult, Role } from "@/types/api";

const DEMO_ORDER: Role[] = ["ADMIN", "PATIENT", "DISPATCHER"];

export function LoginForm() {
  const router = useRouter();
  const redirect = useSearchParams().get("redirect");
  const [pending, start] = useTransition();
  const [busy, setBusy] = useState<Role | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const done = (r: ActionResult) => {
    if (r.error || !r.redirectTo) {
      toast.error(r.error ?? "Login failed");
      return;
    }
    router.replace(redirect?.startsWith("/") ? redirect : r.redirectTo);
    router.refresh();
  };

  const demo = async (role: Role) => {
    const creds = DEMO_CREDENTIALS[role];
    setValue("email", creds.email);
    setValue("password", creds.password);
    setBusy(role);
    done(await demoLoginAction(role));
    setBusy(null);
  };

  return (
    <div className="space-y-5">
      <form
        className="space-y-3"
        onSubmit={handleSubmit((v) => start(async () => done(await loginAction(v))))}
        noValidate
      >
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-semibold">
            Email
          </label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-semibold">
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" disabled={pending || busy !== null}>
          {pending ? "Logging in..." : "🔐 Login"}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span className="h-px flex-1 bg-slate-200" />
        OR
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="space-y-2 text-center">
        <p className="text-sm font-semibold">🚀 Quick Demo Login</p>
        {DEMO_ORDER.map((role) => (
          <Button
            key={role}
            type="button"
            variant="outline"
            className="w-full"
            disabled={busy !== null || pending}
            onClick={() => demo(role)}
          >
            {busy === role ? "Logging in..." : DEMO_CREDENTIALS[role].label}
          </Button>
        ))}
      </div>
    </div>
  );
}
