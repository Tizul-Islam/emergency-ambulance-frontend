import { LinkButton } from "@/components/ui/button";
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-3xl font-extrabold">Page not found</h1>
      <p className="text-slate-600">The page you opened does not exist or was moved.</p>
      <LinkButton href="/">Go to home</LinkButton>
    </main>
  );
}
