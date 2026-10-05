import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/button";
export const metadata: Metadata = { title: "Request an ambulance", description: "Request the nearest ambulance in minutes and follow it on a live status line." };
export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 p-6">
      <h1 className="text-4xl font-extrabold">The nearest ambulance, on its way in minutes</h1>
      <p className="max-w-prose text-slate-600">Tell us where you are. A dispatcher assigns the closest available ambulance and you follow every step until you reach the hospital.</p>
      <div className="flex gap-3"><LinkButton href="/register">Request an ambulance</LinkButton><LinkButton href="/login" variant="outline">Log in</LinkButton></div>
    </main>
  );
}
