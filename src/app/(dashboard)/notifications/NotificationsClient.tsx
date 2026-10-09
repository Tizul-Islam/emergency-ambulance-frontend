"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/url-controls";
import { when } from "@/lib/utils";
import { toast } from "sonner";
import type { Notification, Paged } from "@/types/api";
import { useSocketContext } from "@/components/layout/socket-provider";
import { useNotificationsStore } from "@/store/notifications";

export default function NotificationsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<Notification[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const page = searchParams.get("page") ?? "1";

  useEffect(() => {
    const q = new URLSearchParams({ page, limit: "10" });
    const apiClient = createClient("/api/proxy");
    
    apiClient.get(`/notifications/my?${q}`)
      .then((res) => {
        const result = res.data?.data;
        setData(result?.data || []);
        setMeta(result?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 });
      })
      .catch(() => {
        setData([]);
        setMeta({ page: 1, limit: 10, total: 0, totalPages: 1 });
      });
  }, [page]);

  const socket = useSocketContext();
  useEffect(() => {
    if (!socket) return;
    
    const handleNotification = (notif: Notification) => {
      setData((prev) => [notif, ...prev]);
    };
    
    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  const { decrement } = useNotificationsStore();

  const handleMarkAsRead = async (id: string) => {
    try {
      const apiClient = createClient("/api/proxy");
      await apiClient.patch(`/notifications/${id}/read`);
      toast.success("Notification marked as read");
      setData((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      decrement();
    } catch (error) {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = data.filter((n) => !n.isRead);
    if (unread.length === 0) return;

    try {
      const apiClient = createClient("/api/proxy");
      await Promise.all(
        unread.map((n) => apiClient.patch(`/notifications/${n.id}/read`))
      );
      toast.success("All notifications marked as read");
      setData((prev) => prev.map((n) => ({ ...n, isRead: true })));
      useNotificationsStore.setState((s) => ({ unreadCount: Math.max(0, s.unreadCount - unread.length) }));
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-extrabold">Notifications</h2>
        {data.some((n) => !n.isRead) && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>
      {data.length === 0 ? (
        <EmptyState title="No notifications" hint="Updates about your emergencies and payments appear here." />
      ) : (
        <div className="grid gap-3">
          {data.map((n) => (
            <Card
              key={n.id}
              className={`p-4 ${n.isRead ? "opacity-75" : "border-blue-200 bg-blue-50/30"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-bold">{n.title}</p>
                  <p className="text-sm text-slate-600">{n.message}</p>
                  <p className="mt-1 text-xs text-slate-400">{when(n.createdAt)}</p>
                </div>
                {!n.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(n.id)}
                  >
                    Mark read
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
      <Pagination base="/notifications" meta={meta} params={Object.fromEntries(searchParams.entries())} />
    </div>
  );
}
