import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFollowing } from '../services/profileService';
import { PROFILE_CONSTANTS } from '../constants/profileConstants';

export const useFollowing = (userId) => {
  return useInfiniteQuery({
    queryKey: ['following', userId], // Changed to userId
    queryFn: ({ pageParam = 1 }) => fetchFollowing(userId, pageParam, PROFILE_CONSTANTS.DEFAULT_LIMIT), // Changed to userId
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!userId, // Changed to userId
    staleTime: 5 * 60 * 1000,
  });
};