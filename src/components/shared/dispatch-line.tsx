import { cn, label } from "@/lib/utils";
import { REQUEST_FLOW, type RequestStatus } from "@/types/api";
export function DispatchLine({ status }: { status: RequestStatus }) {
  const now = REQUEST_FLOW.indexOf(status as (typeof REQUEST_FLOW)[number]);
  return (
    <ol className="flex overflow-x-auto pb-2" aria-label="Request progress">
      {REQUEST_FLOW.map((s, i) => (
        <li key={s} aria-current={i === now ? "step" : undefined} className={cn("relative min-w-24 flex-1 text-center text-xs", i <= now ? "text-slate-900" : "text-slate-500")}>
          {i > 0 && <span className={cn("absolute left-[-50%] top-2 h-0.5 w-full", i <= now ? "bg-teal-600" : "bg-slate-200")} />}
          <span className={cn("relative mx-auto mb-1 block h-4 w-4 rounded-full border-2", i < now && "border-teal-600 bg-teal-600", i === now && "border-red-600 bg-red-600 ring-4 ring-red-200", i > now && "border-slate-300 bg-white")} />
          {label(s)}
        </li>
      ))}
    </ol>
  );
}
