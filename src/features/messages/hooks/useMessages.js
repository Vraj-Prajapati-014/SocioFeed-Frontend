import { useQuery } from '@tanstack/react-query';
import useAuth from '../../auth/hooks/useAuth';
import { fetchConversations as fetchConversationsService } from '../services/messagesService';

export const useMessages = () => {
  const { isAuthenticated, isAuthChecked } = useAuth();

  const fetchConversationsData = async () => {
    const conversations = await fetchConversationsService();
    console.log('useMessages - Fetched conversations:', conversations);
    return conversations; 
  };

  const query = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversationsData,
    enabled: isAuthChecked && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    onError: (error) => {
      console.error('useMessages - Error fetching conversations:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    },
  });

  console.log('useMessages - Query state:', {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
  });

  return query;
};