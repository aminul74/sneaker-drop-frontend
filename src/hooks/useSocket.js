import { useEffect, useState, useRef, useCallback } from "react";
import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

/**
 * Hook: useSocket
 * Manages WebSocket connection lifecycle
 * Provides methods to listen and emit events
 */
export const useSocket = () => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socketRef.current.on("connect", () => {
        setConnected(true);
      });

      socketRef.current.on("disconnect", () => {
        setConnected(false);
      });
    }

    return () => {
      // Don't disconnect on unmount - keep connection alive
    };
  }, []);

  const on = useCallback((event, handler) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
      return () => {
        socketRef.current?.off(event, handler);
      };
    }
  }, []);

  const off = useCallback((event, handler) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler);
    }
  }, []);

  const emit = useCallback((event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  }, []);

  return {
    socket: socketRef.current,
    connected,
    on,
    off,
    emit,
  };
};
