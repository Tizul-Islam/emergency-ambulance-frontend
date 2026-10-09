import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/features/login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center p-4">
      <Card className="w-full p-6">
        <h1 className="text-center text-2xl font-extrabold">Welcome Back 👋</h1>
        <p className="mb-5 mt-1 text-center text-sm text-slate-500">
          Login to your account
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="mt-4 text-center text-sm">
          New here?{" "}
          <Link className="font-semibold underline" href="/register">
            Create an account
          </Link>
        </p>
      </Card>
    </main>
  );
}
