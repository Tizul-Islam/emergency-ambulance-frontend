import { PageSkeleton } from "@/components/shared/page-skeleton";

export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg items-center p-4">
      <PageSkeleton />
    </main>
  );
}
