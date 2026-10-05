"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
export function StatsChart({ data }: { data: { priority: string; count: number }[] }) {
  return (
    <div className="h-64" role="img" aria-label="Requests by priority">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="priority" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#0f766e" radius={[4, 4, 0, 0]} /></BarChart>
      </ResponsiveContainer>
    </div>
  );
}
