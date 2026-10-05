import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Meta } from "@/types/api";
const href = (base: string, p: Record<string, string | undefined>) => {
  const q = new URLSearchParams(Object.entries(p).filter(([, v]) => v) as [string, string][]).toString();
  return q ? `${base}?${q}` : base;
};
export function FilterChips({ base, param, options, current, params }: { base: string; param: string; options: { value: string; label: string }[]; current?: string; params: Record<string, string | undefined> }) {
  return (
    <nav aria-label="Filter" className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Link key={o.value} href={href(base, { ...params, [param]: o.value || undefined, page: undefined })} aria-current={(current ?? "") === o.value}
          className={cn("rounded-full border px-3 py-1 text-sm", (current ?? "") === o.value ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white")}>{o.label}</Link>
      ))}
    </nav>
  );
}
export function Pagination({ base, meta, params }: { base: string; meta: Meta; params: Record<string, string | undefined> }) {
  if (meta.totalPages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <span className="text-slate-500">Page {meta.page} of {meta.totalPages}</span>
      <span className="flex gap-2">
        {meta.page > 1 && <Link className="rounded-md border px-3 py-1" href={href(base, { ...params, page: String(meta.page - 1) })}>Previous</Link>}
        {meta.page < meta.totalPages && <Link className="rounded-md border px-3 py-1" href={href(base, { ...params, page: String(meta.page + 1) })}>Next</Link>}
      </span>
    </div>
  );
}
