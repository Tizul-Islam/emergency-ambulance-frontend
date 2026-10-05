import { Card } from "@/components/ui/card";
export const StatCard = ({ title, value }: { title: string; value: string | number }) => (
  <Card><p className="text-sm text-slate-500">{title}</p><p className="mt-1 text-3xl font-extrabold">{value}</p></Card>
);
