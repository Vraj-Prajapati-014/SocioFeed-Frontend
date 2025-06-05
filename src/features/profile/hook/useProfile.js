import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '../services/profileService';

export const useProfile = (userId) => {
  return useQuery({
    queryKey: ['profile', userId], // Changed to userId
    queryFn: () => fetchProfile(userId), // Changed to userId
    enabled: !!userId, // Changed to userId
    staleTime: 5 * 60 * 1000,
    retry: 1,
    onError: (error) => {
      console.error('Failed to fetch profile:', error);
    },
  });
};