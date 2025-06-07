import { useInfiniteQuery } from '@tanstack/react-query';
import { searchUsers } from '../services/profileService';
import { PROFILE_CONSTANTS } from '../constants/profileConstants';
import useAuth from '../../auth/hooks/useAuth';

export const useSearchUsers = (query) => {
  const { user } = useAuth();
  const requestingUserId = user?.id;

  return useInfiniteQuery({
    queryKey: ['searchUsers', query],
    queryFn: ({ pageParam = 1 }) => searchUsers(query, pageParam, PROFILE_CONSTANTS.DEFAULT_LIMIT),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!query && query.trim().length > 0 && !!requestingUserId,
    staleTime: 5 * 60 * 1000,
  });
};