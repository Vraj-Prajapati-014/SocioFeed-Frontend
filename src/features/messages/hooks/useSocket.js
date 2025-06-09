import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { initializeSocket, disconnectSocket, getSocket } from '../services/socketService';

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      setIsConnected(false);
      return;
    }

    const socket = initializeSocket();

    setIsConnected(socket.connected);

    const handleConnect = () => {
      setIsConnected(true);
      console.log('Socket.IO connection established:', socket.id);
    };

    const handleConnectError = (error) => {
      setIsConnected(false);
      if (error.message.includes('Authentication')) {
        console.log('Authentication error handled by socketService:', error.message);
      }
    };

    const handleDisconnect = (reason) => {
      setIsConnected(false);
      console.log('Socket.IO disconnected:', reason);
    };

    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('disconnect', handleDisconnect);
      disconnectSocket();
    };
  }, [isAuthenticated, navigate]);

  return { socket: getSocket(), isConnected };
};

export default useSocket;