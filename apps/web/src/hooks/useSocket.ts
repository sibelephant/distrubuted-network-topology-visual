import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3002';

export function useSocket(topologyId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!topologyId) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to collaboration server');
      socket.emit('joinTopology', topologyId);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from collaboration server');
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [topologyId]);

  return {
    socket: socketRef.current,
    isConnected,
  };
}
