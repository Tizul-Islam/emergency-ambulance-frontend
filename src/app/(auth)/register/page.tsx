import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { RegisterForm } from "@/components/features/register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Patients can request an ambulance right after signing up.",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center p-4">
      <Card className="w-full p-6">
        <h1 className="text-center text-2xl font-extrabold">Create your account</h1>
        <p className="mb-5 mt-1 text-center text-sm text-slate-500">
          Patients can request an ambulance right after signing up.
        </p>
        <RegisterForm />
        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link className="font-semibold underline" href="/login">
            Log in
          </Link>
        </p>
      </Card>
    </main>
  );
}
