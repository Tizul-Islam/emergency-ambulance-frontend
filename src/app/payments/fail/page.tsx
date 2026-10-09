import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";

export default async function PaymentFailPage({
  searchParams,
}: {
  searchParams: Promise<{ tripId?: string }>;
}) {
  const { tripId } = await searchParams;

  return (
    <Card className="max-w-md mx-auto mt-10 p-8 text-center space-y-4 shadow-sm border border-slate-200">
      <div className="text-red-500 text-5xl mb-4">❌</div>
      <h2 className="text-red-600 text-2xl font-bold">Payment Failed</h2>
      <p className="text-slate-600 mb-4">Your payment could not be processed or was cancelled.</p>
      {tripId && <p className="text-xs text-slate-500 mb-4">Trip Reference: {tripId}</p>}
      <LinkButton href="/dashboard" size="default" className="w-full">
        Return to Dashboard
      </LinkButton>
    </Card>
  );
}
