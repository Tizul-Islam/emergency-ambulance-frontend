"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { profileSchema, type ProfileInput } from "@/lib/validations/profile";
import { updateProfileAction } from "@/actions/profile";
import type { User } from "@/types/api";

export function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, phone: user.phone ?? "" },
  });

  return (
    <form
      className="space-y-3"
      noValidate
      onSubmit={handleSubmit((values) =>
        start(async () => {
          const r = await updateProfileAction(values);
          if (r.error) {
            toast.error(r.error);
            return;
          }
          toast.success("Profile updated");
          router.refresh();
        }),
      )}
    >
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-semibold">
          Name
        </label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-semibold">
          Phone
        </label>
        <Input id="phone" {...register("phone")} />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
