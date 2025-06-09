import { Avatar, Typography } from '@mui/material';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../features/auth/hooks/useAuth';
import { useMessages } from '../../features/messages/hooks/useMessages';
import ThemeContext from '../../utils/context/ThemeContext';

const MessagingSidebar = ({ onNavClick }) => {
  const { theme } = useContext(ThemeContext);
  const { user, isAuthenticated, isAuthChecked } = useAuth();
  const navigate = useNavigate();
  const { data: conversations = [], isLoading, refetch } = useMessages();

  useEffect(() => {
    console.log('MessagingSidebar - Conversations:', conversations);
    console.log('MessagingSidebar - Auth state:', { isAuthenticated, isAuthChecked, user });
  }, [conversations, isAuthenticated, isAuthChecked, user]);

  const handleMessageClick = (otherUserId, username) => {
    navigate(`/messages/${otherUserId}`, { state: { username } });
    if (onNavClick) onNavClick();
  };

  const isDark = theme === 'dark';

  if (!isAuthChecked) {
    return (
      <div className={`h-screen p-4 overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <Typography className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Checking authentication...
        </Typography>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={`h-screen p-4 overflow-y-auto ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <Typography className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Please log in to view conversations.
        </Typography>
      </div>
    );
  }

  return (
    <div
      className={`h-screen p-4 overflow-y-auto ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <Typography
          variant="h6"
          className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}
        >
          Messages
        </Typography>
        {/* <button
          className={`text-sm font-medium transition-colors duration-200 ${
            isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => navigate('/messages')}
        >
          See all
        </button> */}
      </div>
      {isLoading ? (
        <Typography className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Loading...
        </Typography>
      ) : conversations.length > 0 ? (
        <ul className="space-y-2">
          {conversations.map((conv) => {
            console.log('MessagingSidebar - Rendering conversation:', conv);
            return (
              <li
                key={conv.user.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleMessageClick(conv.user.id, conv.user.username)}
              >
                <Avatar
                  src={conv.user.avatarUrl || '/default-avatar.png'}
                  alt={conv.user.username}
                  className="w-12 h-12 mr-3 rounded-full object-cover"
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
                {conv.user.id !== user?.id && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full ml-2" />
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <Typography className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          No conversations yet.
        </Typography>
      )}
    </div>
  );
};

export default MessagingSidebar;