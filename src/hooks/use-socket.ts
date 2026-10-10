import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { BASE } from "@/lib/api/client";

export function useSocket(token?: string) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    // BASE is usually e.g., 'http://localhost:5000/api/v1', so we need to get the origin
    const origin = new URL(BASE).origin;
    
    const s = io(origin, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    s.on("connect", () => {
      console.log("Socket connected");
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [token]);

  return socket;
}
