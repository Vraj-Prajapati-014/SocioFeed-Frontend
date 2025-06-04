import React, { useContext } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ThemeContext from '../../utils/context/ThemeContext';

const MessagingSidebar = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const messages = [
    {
      id: 1,
      user: { username: 'jane_doe', avatarUrl: '/default-avatar.png' },
      lastMessage: 'Hey, how are you?',
      timestamp: '10:30 AM',
      unread: true,
    },
    {
      id: 2,
      user: { username: 'mark_smith', avatarUrl: '/default-avatar.png' },
      lastMessage: 'Let’s meet tomorrow!',
      timestamp: 'Yesterday',
      unread: false,
    },
    {
      id: 3,
      user: { username: 'emma_jones', avatarUrl: '/default-avatar.png' },
      lastMessage: 'Check out this link...',
      timestamp: 'Monday',
      unread: true,
    },
  ];

  const handleMessageClick = messageId => {
    navigate(`/messages/${messageId}`);
  };

  const isDark = theme === 'dark';

  return (
    <Box
      className={`h-screen p-4 overflow-y-auto ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      {/* Header */}
      <Box className="mb-4 flex items-center justify-between">
        <Typography
          variant="h6"
          className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}
        >
          Messages
        </Typography>
        <Box
          className={`text-sm cursor-pointer ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
          onClick={() => navigate('/messages')}
        >
          See all
        </Box>
      </Box>

      {/* Message Threads */}
      <List>
        {messages.map(message => (
          <ListItem
            key={message.id}
            button // Fixed: Use shorthand for button prop
            onClick={() => handleMessageClick(message.id)}
            className={`mb-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
              message.unread ? (isDark ? 'bg-gray-700' : 'bg-gray-50') : ''
            }`}
          >
            <ListItemAvatar>
              <Avatar
                src={message.user.avatarUrl}
                alt={message.user.username}
                className="w-12 h-12"
              />
            </ListItemAvatar>
            <ListItemText
              primary={message.user.username}
              secondary={
                <Box component="span" className="flex justify-between items-center">
                  <Typography
                    component="span"
                    variant="body2"
                    className={isDark ? 'text-gray-400' : 'text-gray-600'}
                  >
                    {message.lastMessage}
                  </Typography>
                  <Typography
                    component="span"
                    variant="caption"
                    className={isDark ? 'text-gray-500' : 'text-gray-500'}
                  >
                    {message.timestamp}
                  </Typography>
                </Box>
              }
              primaryTypographyProps={{
                variant: 'subtitle1',
                className: `${isDark ? 'text-gray-200' : 'text-gray-900'} font-medium`,
              }}
              secondaryTypographyProps={{
                component: 'span', // Prevent <p> wrapping
              }}
            />
            {message.unread && <Box className="w-3 h-3 bg-blue-500 rounded-full ml-2" />}
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MessagingSidebar;
