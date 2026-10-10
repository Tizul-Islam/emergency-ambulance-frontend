"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { BASE, createClient } from "@/lib/api/client";
import { toast } from "sonner";
import type { Notification } from "@/types/api";
import { useNotificationsStore } from "@/store/notifications";

const SocketContext = createContext<Socket | null>(null);

export function useSocketContext() {
  return useContext(SocketContext);
}

export function SocketProvider({ children, token }: { children: React.ReactNode; token?: string }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { increment, setUnreadCount } = useNotificationsStore();

  useEffect(() => {
    if (!token) return;

    // Fetch initial unread count
    createClient("/api/proxy", token).get("/notifications/my?limit=1")
      .then(res => {
        if (res.data?.data?.meta?.unreadCount !== undefined) {
          setUnreadCount(res.data.data.meta.unreadCount);
        }
      }).catch(console.error);

    const origin = new URL(BASE).origin;
    const s = io(origin, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    s.on("connect", () => {
      console.log("Real-time socket connected");
    });

    s.on("notification", (notif: Notification) => {
      increment();
      toast.info(`New Notification: ${notif.title}`, {
        description: notif.message,
      });
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(s);

    return () => {
      s.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
