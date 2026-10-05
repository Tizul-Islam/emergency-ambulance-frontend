import { Inbox } from "lucide-react";
export const EmptyState = ({ title, hint }: { title: string; hint?: string }) => (
  <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 p-10 text-center">
    <Inbox className="h-8 w-8 text-slate-400" aria-hidden /><p className="font-semibold">{title}</p>{hint && <p className="text-sm text-slate-500">{hint}</p>}
  </div>
);
