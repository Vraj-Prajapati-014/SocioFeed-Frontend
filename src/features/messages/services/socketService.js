import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';
const SOCKET_PATH = '/socket.io';

let socket = null;

export const initializeSocket = (token) => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    path: SOCKET_PATH,
    withCredentials: true,
    transports: ['websocket'],
    auth: { token },
  });

  socket.on('connect', () => {
    console.log('WebSocket connected:', socket.id);
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error.message);
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;