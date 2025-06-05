import { useInfiniteQuery } from '@tanstack/react-query';
import { searchUsers } from '../services/profileService';
import { PROFILE_CONSTANTS } from '../constants/profileConstants';

export const useSearchUsers = (query) => {
  return useInfiniteQuery({
    queryKey: ['searchUsers', query],
    queryFn: ({ pageParam = 1 }) => searchUsers(query, pageParam, PROFILE_CONSTANTS.DEFAULT_LIMIT),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!query && query.trim().length > 0,
    staleTime: 5 * 60 * 1000,
  });
};