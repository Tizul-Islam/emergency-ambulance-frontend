"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterInput } from "@/schemas";
import { registerAction } from "@/actions/auth";
const FIELDS: { name: keyof RegisterInput; label: string; type: string; auto: string }[] = [
  { name: "name", label: "Full name", type: "text", auto: "name" }, { name: "email", label: "Email", type: "email", auto: "email" },
  { name: "phone", label: "Phone", type: "tel", auto: "tel" }, { name: "password", label: "Password", type: "password", auto: "new-password" },
];
export function RegisterForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema), mode: "onChange" });
  return (
    <form className="space-y-3" noValidate onSubmit={handleSubmit((v) => start(async () => {
      const r = await registerAction(v);
      if (r.error || !r.redirectTo) return void toast.error(r.error ?? "Registration failed");
      router.replace(r.redirectTo); router.refresh();
    }))}>
      {FIELDS.map((f) => (
        <div key={f.name}><label htmlFor={f.name} className="mb-1 block text-sm font-semibold">{f.label}</label><Input id={f.name} type={f.type} autoComplete={f.auto} {...register(f.name)} />{errors[f.name] && <p className="mt-1 text-sm text-red-600">{errors[f.name]?.message}</p>}</div>
      ))}
      <Button type="submit" className="w-full" disabled={pending}>{pending ? "Creating account..." : "Create account"}</Button>
    </form>
  );
}
