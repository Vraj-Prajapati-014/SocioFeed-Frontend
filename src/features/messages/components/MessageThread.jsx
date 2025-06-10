import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, IconButton, Avatar } from '@mui/material';
import { Send as SendIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ThemeContext from '../../../utils/context/ThemeContext';
import { useConversation } from '../hooks/useConversation';
import useSocket from '../hooks/useSocket';
import useAuth from '../../auth/hooks/useAuth';
import { sendMessage, deleteMessage } from '../services/messagesService';
import { showToast } from '../../../utils/helpers/toast';
import ProfileHeader from '../../../features/profile/components/ProfileHeader';
import { fetchProfile } from '../../../features/profile/services/profileService';

const MessageThread = () => {
  const { id: otherUserId } = useParams();
  const { user, isAuthenticated, isAuthChecked } = useAuth();
  const { theme } = useContext(ThemeContext);
  const { socket, isConnected } = useSocket();
  const { data: messages = [], isLoading, refetch } = useConversation(isAuthenticated ? otherUserId : null);
  const [newMessage, setNewMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [receiverProfile, setReceiverProfile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isReceiverOnline, setIsReceiverOnline] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const isDark = theme === 'dark';
    const isValidUUID = (otherUserId) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(otherUserId);
};
  const navigate = useNavigate();

     if (!otherUserId || !isValidUUID(otherUserId)) {
      console.error('Invalid user ID format:', otherUserId);
      showToast('Invalid profile ID', 'error');
      navigate('/not-found', { state: { message: 'Invalid profile ID format.' } });
      return;
    }

  // Fetch receiver's profile data and update on follow/unfollow
  useEffect(() => {
    const loadReceiverProfile = async () => {
      if (!isAuthenticated || !otherUserId) return;
      try {
        const profileData = await fetchProfile(otherUserId);
        setReceiverProfile(profileData);
        setIsReceiverOnline(profileData.isOnline || false);
      } catch (error) {
        console.error('Error fetching receiver profile:', error);
        showToast('Failed to load receiver profile', 'error');
      }
    };

    loadReceiverProfile();
  }, [otherUserId, isAuthenticated]);

  // Sync messages from useConversation with local state
  useEffect(() => {
    setMessageList(messages);
  }, [messages]);

  // Scroll to the bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList, isTyping]);

  // Handle WebSocket events
  useEffect(() => {
    if (!socket || !isAuthenticated || !user) return;

    socket.on('message', (message) => {
      if (
        (message.sender.id === user.id && message.receiver.id === otherUserId) ||
        (message.sender.id === otherUserId && message.receiver.id === user.id)
      ) {
        setMessageList((prev) => {
          if (prev.some((msg) => msg.id === message.id)) {
            return prev;
          }
          return [
            ...prev,
            {
              id: message.id,
              content: message.content,
              createdAt: message.createdAt,
              sender: message.sender,
              receiver: message.receiver,
            },
          ];
        });
      }
    });

    socket.on('messageDeleted', ({ messageId }) => {
      setMessageList((prev) => prev.filter((msg) => msg.id !== messageId));
      refetch();
    });

    socket.on('typing', ({ senderId }) => {
      if (senderId === otherUserId) {
        setIsTyping(true);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    });

    socket.on('userStatus', ({ userId, status }) => {
      if (userId === otherUserId) {
        setIsReceiverOnline(status === 'online');
      }
    });

    socket.on('error', (error) => {
      showToast(error.message, 'error');
    });

    return () => {
      socket.off('message');
      socket.off('messageDeleted');
      socket.off('typing');
      socket.off('userStatus');
      socket.off('error');
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket, user, otherUserId, isAuthenticated, refetch]);

  const handleTyping = () => {
    if (socket && otherUserId) {
      socket.emit('typing', { receiverId: otherUserId });
    }
  };

  const handleSendMessage = async () => {
    if (!isAuthenticated) {
      showToast('Please log in to send messages', 'error');
      return;
    }

    if (!newMessage.trim()) {
      showToast('Message cannot be empty', 'error');
      return;
    }

    if (!isConnected) {
      showToast('Not connected to chat server', 'error');
      return;
    }

    try {
      const sentMessage = await sendMessage(otherUserId, newMessage);
      if (
        !sentMessage ||
        !sentMessage.id ||
        !sentMessage.content ||
        !sentMessage.createdAt ||
        !sentMessage.sender ||
        !sentMessage.receiver
      ) {
        throw new Error('Invalid message response from server');
      }
      socket.emit('sendMessage', { receiverId: otherUserId, content: newMessage }, (response) => {
        if (response.status !== 'success') {
          showToast('Failed to broadcast message: ' + response.message, 'error');
        }
      });
      setNewMessage('');
      refetch();
    } catch (error) {
      showToast('Failed to send message: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!isConnected) {
      showToast('Not connected to chat server', 'error');
      return;
    }

    try {
      await deleteMessage(messageId);
      socket.emit('deleteMessage', { messageId }, (response) => {
        if (response.status !== 'success') {
          showToast('Failed to broadcast message deletion: ' + response.message, 'error');
        }
      });
      setMessageList((prev) => prev.filter((msg) => msg.id !== messageId));
      refetch();
    } catch (error) {
      showToast('Failed to delete message: ' + (error.message || 'Unknown error'), 'error');
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setReceiverProfile(updatedProfile);
    setIsReceiverOnline(updatedProfile.isOnline || false);
  };

  if (!isAuthChecked) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <Typography className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Checking authentication...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <Typography className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Please log in to view messages.
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={`flex flex-col h-screen p-4 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg`}>
      <Box className="mb-2">
        <Typography
          variant="caption"
          className={isConnected ? 'text-green-500' : 'text-red-500'}
        >
          Chat Server: {isConnected ? 'Connected' : 'Disconnected'}
        </Typography>
      </Box>

      {receiverProfile ? (
        <Box className="mb-4">
          <ProfileHeader
            profile={receiverProfile}
            isOwnProfile={false}
            onProfileUpdate={handleProfileUpdate}
          />
          <Typography
            variant="caption"
            className={isReceiverOnline ? 'text-green-500' : 'text-gray-500'}
            sx={{ ml: 2 }}
          >
            {isReceiverOnline ? 'Online' : 'Offline'}
          </Typography>
        </Box>
      ) : (
        <Box className="flex items-center justify-center p-4">
          <Typography className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Loading receiver profile...
          </Typography>
        </Box>
      )}

      <Box className="flex-1 overflow-y-auto mb-4" sx={{ maxHeight: 'calc(100vh - 200px)' }}>
        {isLoading ? (
          <Typography className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Loading messages...
          </Typography>
        ) : messageList.length > 0 ? (
          messageList.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${
                message.sender.id === user.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className="flex items-end">
                {message.sender.id !== user.id && (
                  <Avatar
                    src={message.sender.avatarUrl || '/default-avatar.png'}
                    alt={message.sender.username}
                    className="w-8 h-8 mr-2"
                  />
                )}
                <div
                  className={`p-3 rounded-lg max-w-xs ${
                    message.sender.id === user.id
                      ? 'bg-blue-500 text-white'
                      : isDark
                      ? 'bg-gray-700 text-gray-200'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <Typography variant="body2">{message.content}</Typography>
                  <div className="flex justify-between items-center mt-1">
                    <Typography
                      variant="caption"
                      className={isDark ? 'text-gray-400' : 'text-gray-600'}
                    >
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                    {message.sender.id === user.id && (
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteMessage(message.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </div>
                </div>
                {message.sender.id === user.id && (
                  <Avatar
                    src={message.sender.avatarUrl || '/default-avatar.png'}
                    alt={message.sender.username}
                    className="w-8 h-8 ml-2"
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <Typography className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            No messages yet.
          </Typography>
        )}
        {isTyping && (
          <Typography className={isDark ? 'text-gray-400' : 'text-gray-600'} sx={{ mt: 1 }}>
            {receiverProfile?.username || 'User'} is typing...
          </Typography>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box className="flex items-center">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              backgroundColor: isDark ? '#4B5563' : '#F3F4F6',
              color: isDark ? '#F3F4F6' : '#1F2937',
              '& fieldset': {
                borderColor: isDark ? '#6B7280' : '#D1D5DB',
              },
              '&:hover fieldset': {
                borderColor: isDark ? '#9CA3AF' : '#9CA3AF',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3B82F6',
              },
            },
            '& .MuiInputBase-input': {
              padding: '10px 14px',
            },
          }}
        />
        <IconButton
          onClick={handleSendMessage}
          className="ml-2"
          sx={{
            backgroundColor: '#3B82F6',
            color: 'white',
            '&:hover': { backgroundColor: '#2563EB' },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MessageThread;