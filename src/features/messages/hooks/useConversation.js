import { useQuery } from '@tanstack/react-query';
import { fetchMessages } from '../services/messagesService';

export const useConversation = (otherUserId) => {
  return useQuery({
    queryKey: ['messages', otherUserId],
    queryFn: () => fetchMessages(otherUserId),
    enabled: !!otherUserId,
    staleTime: 5 * 60 * 1000,
    select: (data) =>
      data.map((message) => ({
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        sender: {
          id: message.sender.id,
          username: message.sender.username || 'Unknown',
          avatarUrl: message.sender.avatarUrl || '/default-avatar.png',
        },
        receiver: {
          id: message.receiver.id,
          username: message.receiver.username || 'Unknown',
          avatarUrl: message.receiver.avatarUrl || '/default-avatar.png',
        },
      })),
  });
};