import React, { useContext, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThemeContext from '../../../utils/context/ThemeContext';
import { useMessages } from '../hooks/useMessages';
import useAuth from '../../auth/hooks/useAuth';
import { useSocket } from '../hooks/useSocket';

const MessagesList = () => {
  const { theme } = useContext(ThemeContext);
  const { isAuthenticated, isAuthChecked } = useAuth();
  const navigate = useNavigate();
  const socket = useSocket();
  const { data: conversations = [], isLoading, refetch } = useMessages();

  const isDark = theme === 'dark';

  useEffect(() => {
    if (!socket || !isAuthenticated) return;

    socket.on('message', () => {
      refetch();
    });

    return () => {
      socket.off('message');
    };
  }, [socket, isAuthenticated, refetch]);

  const handleMessageClick = (otherUserId, username, avatarUrl) => {
    navigate(`/messages/${otherUserId}`, { state: { username, avatarUrl } });
  };

  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Typography className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Checking authentication...
        </Typography>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Typography className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Please log in to view messages.
        </Typography>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 md:p-6 lg:p-8 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`p-4 rounded-lg shadow-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <Typography
          variant="h6"
          className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-black'}`}
        >
          Messages
        </Typography>
        {isLoading ? (
          <Typography className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Loading...
          </Typography>
        ) : conversations.length > 0 ? (
          <ul className="space-y-2">
            {conversations.map(conv => (
              <li
                key={conv.user.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleMessageClick(conv.user.id, conv.user.username, conv.user.avatarUrl)}
              >
                <img
                  src={conv.user.avatarUrl || '/default-avatar.png'}
                  alt={conv.user.username}
                  className="w-12 h-12 rounded-full mr-3 object-cover"
                />
                <div className="flex-1">
                  <div className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                    {conv.user.username}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {conv.lastMessage.length > 20
                        ? `${conv.lastMessage.slice(0, 20)}...`
                        : conv.lastMessage}
                    </span>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {conv.lastMessageAt
                        ? new Date(conv.lastMessageAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Typography className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            No conversations yet.
          </Typography>
        )}
      </div>
    </div>
  );
};

export default MessagesList;