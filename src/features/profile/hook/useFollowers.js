import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchFollowers } from '../services/profileService';
import { PROFILE_CONSTANTS } from '../constants/profileConstants';
import useAuth from '../../auth/hooks/useAuth';

export const useFollowers = (userId) => {
  const { user } = useAuth();
  const requestingUserId = user?.id;

  return useInfiniteQuery({
    queryKey: ['followers', userId],
    queryFn: ({ pageParam = 1 }) => fetchFollowers(userId, pageParam, PROFILE_CONSTANTS.DEFAULT_LIMIT),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!userId && !!requestingUserId,
    staleTime: 5 * 60 * 1000,
  });
};