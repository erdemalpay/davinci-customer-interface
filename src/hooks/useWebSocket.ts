import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Socket, io } from "socket.io-client";
import { socketEventListeners } from "./socketConstant";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;
export function useWebSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket.");
    });

    socketEventListeners.forEach((eventConfig) => {
      socket.on(eventConfig.event, () => {
        // Handle the event here if needed
        console.log(`Received event: ${eventConfig.event}`);
        eventConfig.invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
}
