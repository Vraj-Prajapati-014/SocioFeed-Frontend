import { useEffect, useState } from 'react';
import { initializeSocket, disconnectSocket, getSocket } from '../services/socketService';
import { useDispatch, useSelector } from 'react-redux';
import { refreshTokenAsync } from '../../auth/slices/authSlice';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) return;

    const newSocket = initializeSocket();
    setSocket(newSocket);

    if (newSocket) {
      newSocket.on('connect_error', async (error) => {
        if (error.message === 'WebSocket authentication failed') {
          try {
            await dispatch(refreshTokenAsync()).unwrap();
            disconnectSocket();
            const refreshedSocket = initializeSocket();
            setSocket(refreshedSocket);
          } catch (refreshError) {
            console.error('Failed to refresh token for WebSocket:', refreshError);
            window.location.href = '/login';
          }
        }
      });
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, dispatch]);

  return socket;
};