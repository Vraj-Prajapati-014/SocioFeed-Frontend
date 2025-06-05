import { useQuery } from '@tanstack/react-query';
import { fetchMessages } from '../services/messagesService';

export const useMessages = () => {
  return useQuery({
    queryKey: ['messages'],
    queryFn: fetchMessages,
    staleTime: 5 * 60 * 1000,
    // Mock data for now
    placeholderData: [
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
    ],
  });
};