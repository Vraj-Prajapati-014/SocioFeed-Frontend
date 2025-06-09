import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';
const SOCKET_PATH = '/socket.io';

let socketRef = { current: null };

export const initializeSocket = () => {
  if (socketRef.current) return socketRef.current;

  socketRef.current = io(SOCKET_URL, {
    path: SOCKET_PATH,
    withCredentials: true,
    transports: ['websocket'],
  });

  socketRef.current.on('connect', () => {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    console.log(`[${timestamp}] WebSocket connected: ${socketRef.current.id}`);
  });

  socketRef.current.on('connect_error', async (error) => {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    console.error(`[${timestamp}] WebSocket connection error: ${error.message}`);
  });

  socketRef.current.on('disconnect', (reason) => {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    console.log(`[${timestamp}] WebSocket disconnected: ${reason}`);
  });

  return socketRef.current;
};

export const disconnectSocket = () => {
  if (socketRef.current) {
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    console.log(`[${timestamp}] Disconnecting WebSocket manually`);
    socketRef.current.disconnect();
    socketRef.current = null;
  }
};

export const getSocket = () => socketRef.current;