import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ErrorState({
  title = "Something went wrong",
  message,
  retry,
}: {
  title?: string;
  message?: string;
  retry?: () => void;
}) {
  return (
    <Card className="p-6 text-center">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">
        {message ?? "We could not load this page. Please try again."}
      </p>
      {retry && (
        <Button className="mt-4" onClick={retry}>
          Retry
        </Button>
      )}
    </Card>
  );
}
